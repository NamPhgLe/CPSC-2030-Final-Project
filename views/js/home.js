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
        document.querySelector("#signup").onclick = signup
        document.querySelector("#signout").onclick = signout
        document.querySelector("#signin").onclick = signin

    })

})();
