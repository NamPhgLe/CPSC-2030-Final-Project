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

 
    const sections = document.querySelectorAll("section");


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
                // localStorage.setItem("userEmail", reply.email)
                displaySection(navigation.home)
                authorize(true)
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

        // localStorage.removeItem("userEmail")

        window.history.pushState(navigation.home, "", `/${navigation.home.url}`)
        displaySection(navigation.home)
        authorize(false)
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
            // localStorage.setItem("userEmail", reply.email)
            // window.history.pushState(navigation.orders, "", `/${navigation.orders.url}`)
            displaySection(navigation.home)
            authorize(true)
        }
        else if (reply.role === "admin") {
            // localStorage.setItem("userEmail", reply.email)
            authorize(true)

            const authenticated = document.querySelectorAll('[authenticated]')

            hide(authenticated)
            authenticated.forEach(element => hide(element))
        }
        // else if (!reply.hasOwnProperty("role")) {
            // registerWarning.innerHTML = 'Passwords do not match. Re-enter your password'
            // show(registerWarning)
        // }
    }
    
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

    const displaySection = (state) => {
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

    })

    const authorize = (isAuthenticated) => {
        const authenticated = document.querySelectorAll('[authenticated]')
        const nonAuthenticated = document.querySelector('[nonAuthenticated]')
        if (isAuthenticated) {
            authenticated.forEach(element => show(element))
            hide(nonAuthenticated)
        }
        else {
            authenticated.forEach(element => hide(element))
            show(nonAuthenticated)
        }
    }


})();
