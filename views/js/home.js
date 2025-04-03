(() => {

    const navigation = {
        home: { title: "Home Page", url: "home", section: "home" },
        resume: { title: "Resume Page", url: "resume", section: "resume" },
        about: { title: "About Page", url: "about", section: "about" },
        evaluation: { title: "Evaluation Page", url: "evaluation", section: "evaluation" },
        admin: { title: "Admin Dashboard", url: "admin", section: "admin" },
        signin: { title: "Sign In", url: "signin", section: "signin" },
        signup: { title: "Sign Up", url: "signup", section: "signup" },
        signout: { title: "Sign Out", url: "signout", section: "signout"},
        terms: { title: "Terms and Conditions", url: "terms", section: "terms" },
        notFound: { title: "Page Not Found", url: "404", section: "404" }
      };

    const show = (section) => { section.style.display = 'block'; }
    const hide = (section) => { section.style.display = 'none'; }
    
    const postData = async (url = '', data = {}) => {
        console.log("url", url)
        // Default options are marked with *
        const response = await fetch(url, {
            method: 'POST', // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header
        })
        const responseData = await response.json()
        return responseData // parses JSON response into native JavaScript objects
    }

    const signup = async (event) => {
        // prevent refreshing the page
        event.preventDefault()
        email = document.querySelector('#signup input[name="email"]').value
        let password = document.querySelector('#signup input[name="password"]').value
        let confirm = document.querySelector('#confirmPassword').value

        if (password == confirm) {
            const reply = await postData('/api/user/signup', { email, password })
            console.log(reply)
            if (!reply.hasOwnProperty("role")) {
                // registerWarning.innerHTML = `${reply.error}`
                // show(registerWarning)
            }
            else if (reply.role === "member") {
                localStorage.setItem("userEmail", reply.email)
                displaySection(navigation.home)
                authorize(true, false)
            }
        }
        else if (!reply.hasOwnProperty("role")) {
                displaySection(navigation.home)
            // registerWarning.innerHTML = 'Passwords do not match. Re-enter your password'
            // show(registerWarning)
        }
    }

    // signout Function
    const signout = async (event) => {
        event.preventDefault()
    
        localStorage.removeItem("userEmail")
        localStorage.removeItem("authToken")  
    
        const email = localStorage.getItem('userEmail')
    
        try {
            const signoutResponse = await postData('/api/user/signout', { email });
    
            if (signoutResponse.success) {
                localStorage.removeItem('userEmail');
                localStorage.removeItem('authToken'); 
            } else {
                console.log('Error:', signoutResponse.error);
            }
        } catch (error) {
            console.error("Error during sign out:", error);
        }
    
        window.history.pushState(navigation.home, "", `/${navigation.home.url}`)
        const evaluationPage = document.getElementById('results');
        if (evaluationPage) {
            evaluationPage.innerHTML = ''; 
        }
        displaySection(navigation.home)
        authorize(false, false)
        resetFormInputs();
        resetEvaluationOutputs();
    }

    // signin function
    const signin = async (event) => {
        event.preventDefault()
        email = document.querySelector('#signin input[name="email"]').value
        // console.log(email)
        let password = document.querySelector('#signin input[name="password"]').value
        const reply = await postData('/api/user/signin', { email, password })
        // console.log(reply)

        if (!reply.hasOwnProperty("role")) {
            // signinWarning.innerHTML = `${reply}`
            // show(signinWarning)
        }
        else if (reply.role === "member") {
            localStorage.setItem("userEmail", reply.email)
            // window.history.pushState(navigation.orders, "", `/${navigation.orders.url}`)
            displaySection(navigation.home)
            authorize(true, false)
            document.querySelector('[authenticated] > span').innerHTML = `${email}`
        }
        else if (reply.role === "admin") {
            localStorage.setItem("userEmail", reply.email)
            displayAdminInfo()
            displaySection(navigation.home)
            authorize(true, true)

            document.querySelector('[authenticated] > span').innerHTML = `Admin`
            
        }
        // else if (!reply.hasOwnProperty("role")) {
            // registerWarning.innerHTML = 'Passwords do not match. Re-enter your password'
            // show(registerWarning)
        // }
    }

    const authorize = (isAuthenticated, isAdmin) => {
        const authenticated = document.querySelectorAll('[authenticated]')
        const authenticatedAdmin = document.querySelectorAll('[authenticatedAdmin]')
        const nonAuthenticated = document.querySelectorAll('[nonAuthenticated]')
        if (isAuthenticated && !isAdmin) {
            authenticated.forEach(element => show(element));
            authenticatedAdmin.forEach(element => hide(element));
            nonAuthenticated.forEach(element => hide(element));
        } else if(isAdmin){ 
            authenticated.forEach(element => show(element));
            authenticatedAdmin.forEach(element => show(element));
            nonAuthenticated.forEach(element => hide(element));
        } else {
            authenticated.forEach(element => hide(element)); 
            authenticatedAdmin.forEach(element => hide(element));  
            nonAuthenticated.forEach(element => show(element));
        }
    }

    const resetFormInputs = () => {
        const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], textarea');
        inputs.forEach(input => {
            input.value = ''; 
        });
    };

    const resetEvaluationOutputs = () => { 
        const output = document.getElementById('results');
        output.innerHTML = "";
    }
     // set active
     const setActivePage = (name) => {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('page') === name) {
                link.classList.add('active'); 
            } else {
                link.classList.remove('active');
            }
        });
    }
    // fetch and display evaluation
    const getResumeAnalysis = async (file) => {
        
        let textA = document.getElementById('resumeRequirements').value;
        let selectedRole = document.querySelector('input[name="role"]:checked').value;
        let additionalInfo = {
            role: selectedRole,
            requirements: textA,
            resume: file
        };

        try {
            const response = await fetch('/api/checkResumeFile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ additionalInfo }),
            });

            const data = await response.json();
        if (data) {
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <h4 class="text-primary">Results</h4>
                <p class="lead text-muted">${data}</p>
            `;
            displaySection(navigation.evaluation)
            } else {
                const resultsDiv = document.getElementById('results');
                resultsDiv.innerHTML = `
                    <h4 class="text-danger">Error</h4>
                    <p class="lead text-muted">No feedback received. Please try again later.</p>
                `;
            }
        } catch (error) {
            console.error('Error:', error);
            const resultsDiv = document.getElementById('results');
            resultsDiv.innerHTML = `
                <h4 class="text-danger">Error</h4>
                <p class="lead text-muted">There was an issue retrieving the results. Please try again later.</p>
            `;
        }
    };

    // check if valid file and call postResumeData
    const checkResume = async (event) => {
        event.preventDefault();
        const fileInput = document.getElementById('resumeFile');
        const file = fileInput.files[0];
    
        if (!file) {
            alert('Please select a resume file or provide a resume URL.');
            return;
        }
    
        if (file) {
            await getResumeAnalysis(file);
        }
        
    }


    const displaySection = (state) => {
        const sections = document.querySelectorAll("section");
        sections.forEach(section => {
            const name = section.getAttribute('id');
            if (name === state.section) {
                document.title = state.title; 
                show(section);
                setActivePage(name); 
            } else {
                hide(section); 
            }
        });
    }

    const displayAdminInfo = async () => {
        try {
            const response = await fetch(`/api/userStats`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorMessage = await response.json();
                throw new Error(errorMessage.message);
            }

            const userInfo = await response.json();
            
            const resumesUploaded  = document.getElementById('resumesUploaded');
            const usersSignedUp  = document.getElementById('usersSignedUp');
            const activeUsers = document.getElementById('activeUsers');

            resumesUploaded.innerHTML = userInfo.resumeUploads;  
            usersSignedUp.innerHTML = userInfo.userCount;       
            activeUsers.innerHTML = userInfo.activeUsers;      

        } catch (error) {
            console.error('Failed to fetch orders:', error.message);
        }
    }

    document.addEventListener("DOMContentLoaded", () => {
        displaySection(navigation.home)
        window.history.replaceState(navigation.home, "", document.location.href);
        document.onclick = (event) => {
            const page = event.target.getAttribute('page')
            if (page) {
                event.preventDefault()
                window.history.pushState(navigation[page], "", `/ ${navigation[page].url} `)
                displaySection(navigation[page])
            }
        }
        const noticeDialog = document.querySelector("#noticeDialog")
        const errors = document.querySelectorAll('section div[name="error"]')
        errors.forEach(error => hide(error))

        noticeDialog.showModal()
        document.querySelector("#noticeButton").onclick = (event) => {
            event.preventDefault()
            if (document.querySelector("#agree").checked)
                noticeDialog.close()
        }
        document.querySelector("#signUpBtn").onclick = signup
        document.querySelector("#signoutBtn").onclick = signout
        document.querySelector("#signinBtn").onclick = signin
        document.querySelector("#resumeData").onclick = checkResume
        

    })

    document.addEventListener("DOMContentLoaded", () => {
        if (localStorage.getItem("userEmail") !== null) {
            const storedEmail = localStorage.getItem("userEmail");
            if(localStorage.getItem("userEmail") === "admin@gmail.com"){
                displayAdminInfo()
                displaySection(navigation.home)
                authorize(true, true)

                document.querySelector('[authenticated] span').innerHTML = 'Admin';
                
            } else {
                authorize(true, false)
                document.querySelector('[authenticated] span').innerHTML = storedEmail;
            }
        } else {
            authorize(false, false)
        }
    })

    
})();
