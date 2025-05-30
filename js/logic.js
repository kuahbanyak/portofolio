document.addEventListener('DOMContentLoaded', function() {
    const header = document.getElementById('header');
    const navLinksContainer = document.querySelector('nav ul.nav-links');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('main section');
    const scrollToTopBtn = document.querySelector('.scroll-to-top');

    // Efek header saat scroll
    window.addEventListener('scroll', function() {
        if (window.scrollY > 30) { // Threshold lebih kecil untuk efek lebih cepat
            if(header) header.classList.add('scrolled');
        } else {
            if(header) header.classList.remove('scrolled');
        }

        // Tampilkan/sembunyikan tombol scroll to top
        if (window.pageYOffset > 200) { // Threshold lebih kecil
            if(scrollToTopBtn) {
                if (scrollToTopBtn.style.display !== 'block') {
                    scrollToTopBtn.style.display = 'block';
                    // Force reflow untuk memastikan transisi opacity berjalan
                    void scrollToTopBtn.offsetWidth;
                    scrollToTopBtn.style.opacity = '1';
                }
            }
        } else {
            if(scrollToTopBtn) {
                scrollToTopBtn.style.opacity = '0';
                // Sembunyikan setelah transisi selesai
                setTimeout(() => {
                    if (window.pageYOffset <= 200) { // Cek lagi untuk menghindari race condition
                        scrollToTopBtn.style.display = 'none';
                    }
                }, 300);
            }
        }

        // Highlight navigasi aktif saat scroll
        let currentSectionId = '';
        let minDistance = Infinity;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            // const sectionHeight = section.clientHeight; // Tidak digunakan saat ini
            const distanceToTop = Math.abs(window.pageYOffset - (sectionTop - (header ? header.offsetHeight : 70) - 50));

            const rect = section.getBoundingClientRect();
            // const visibleHeight = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0); // Tidak digunakan saat ini

            if (rect.top <= (header ? header.offsetHeight : 70) + 50 && rect.bottom >= (header ? header.offsetHeight : 70) + 50) {
                if (distanceToTop < minDistance) {
                    minDistance = distanceToTop;
                    currentSectionId = section.getAttribute('id');
                }
            } else if (rect.bottom > (header ? header.offsetHeight : 70) + 50 && rect.top < window.innerHeight && distanceToTop < minDistance) {
                // Fallback jika tidak ada section yang pas di atas,
                // tapi bagian bawahnya masih terlihat atau bagian atasnya baru masuk viewport
                minDistance = distanceToTop;
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const linkHref = link.getAttribute('href');
            if (linkHref && linkHref.substring(1) === currentSectionId) {
                link.classList.add('active');
            }
        });
        // Jika di paling atas, set 'Beranda' sebagai aktif
        if (sections.length > 0 && window.pageYOffset < sections[0].offsetTop - (header ? header.offsetHeight : 70) - 100) {
            navLinks.forEach(link => link.classList.remove('active'));
            const homeLink = document.querySelector('nav ul li a[href="#hero"]');
            if(homeLink) homeLink.classList.add('active');
        }
    });

    // Toggle menu mobile
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            if(navLinksContainer) navLinksContainer.classList.toggle('active');
            this.classList.toggle('open');
            document.body.style.overflow = navLinksContainer.classList.contains('active') ? 'hidden' : '';
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (navLinksContainer && navLinksContainer.classList.contains('active')) {
                navLinksContainer.classList.remove('active');
                if(menuToggle) menuToggle.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    });
    document.addEventListener('click', function(event) {
        const isClickInsideNav = navLinksContainer && navLinksContainer.contains(event.target);
        const isClickOnToggle = menuToggle && menuToggle.contains(event.target);

        if (!isClickInsideNav && !isClickOnToggle && navLinksContainer && navLinksContainer.classList.contains('active')) {
            navLinksContainer.classList.remove('active');
            if(menuToggle) menuToggle.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    if(scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Efek fade-in untuk seksi saat scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

});