document.addEventListener('DOMContentLoaded', () => {
  // Initialize Animate On Scroll (AOS)
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease-out-quad'
    });
  }
  // ==========================================================================
  // 1. SCROLL PROGRESS BAR
  // ==========================================================================
  const progressBar = document.getElementById('progress-bar');
  
  window.addEventListener('scroll', () => {
    const windowScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = height > 0 ? (windowScroll / height) * 100 : 0;
    progressBar.style.width = scrolled + '%';
  });

  // ==========================================================================
  // 2. THEME TOGGLER (DARK / LIGHT MODE)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set theme based on LocalStorage or system preference (default dark)
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !systemPrefersDark)) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    if (document.body.classList.contains('dark-theme')) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
      localStorage.setItem('theme', 'light');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
      localStorage.setItem('theme', 'dark');
    }
  });

  // ==========================================================================
  // 3. MOBILE MENU TOGGLER
  // ==========================================================================
  const mobileToggleBtn = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  const toggleMenu = () => {
    const isOpen = mobileToggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
    mobileToggleBtn.setAttribute('aria-expanded', isOpen);
  };

  mobileToggleBtn.addEventListener('click', toggleMenu);

  // Close menu when clicking navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  // Close menu on resize window if open
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
      toggleMenu();
    }
  });

  // ==========================================================================
  // 4. ACTIVE NAVIGATION LINK ON SCROLL (INTERSECTION OBSERVER)
  // ==========================================================================
  const sections = document.querySelectorAll('section');
  
  const observerOptions = {
    root: null,
    rootMargin: '-30% 0px -60% 0px', // Trigger when section occupies the middle of screen
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // ==========================================================================
  // 5. CONTACT FORM VALIDATION & TOAST ALERT
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');

  const showToast = (message, isSuccess = true) => {
    toastMessage.textContent = message;
    if (isSuccess) {
      toast.style.backgroundColor = 'hsl(142, 70%, 45%)'; // Success Green
    } else {
      toast.style.backgroundColor = 'hsl(0, 85%, 60%)'; // Error Red
    }
    
    toast.classList.add('show');
    toast.setAttribute('aria-hidden', 'false');

    setTimeout(() => {
      toast.classList.remove('show');
      toast.setAttribute('aria-hidden', 'true');
    }, 4000);
  };

  const validateEmail = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  };

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    
    const nameGroup = nameInput.parentElement;
    const emailGroup = emailInput.parentElement;
    const messageGroup = messageInput.parentElement;

    let hasErrors = false;

    // Reset error styling
    nameGroup.classList.remove('has-error');
    emailGroup.classList.remove('has-error');
    messageGroup.classList.remove('has-error');

    // Validate Name
    if (!nameInput.value.trim()) {
      nameGroup.classList.add('has-error');
      hasErrors = true;
    }

    // Validate Email
    if (!emailInput.value.trim() || !validateEmail(emailInput.value.trim())) {
      emailGroup.classList.add('has-error');
      hasErrors = true;
    }

    // Validate Message
    if (!messageInput.value.trim()) {
      messageGroup.classList.add('has-error');
      hasErrors = true;
    }

    if (hasErrors) {
      showToast('Please correct the highlighted fields.', false);
      return;
    }

    // Success Simulation
    const submitBtn = contactForm.querySelector('.btn-submit');
    const originalBtnHTML = submitBtn.innerHTML;
    
    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Sending... <span class="spinner"></span>'; // Visual loading state

    // Send form data via FormSubmit.co API
    fetch("https://formsubmit.co/ajax/dhanushcharlie2004@gmail.com", {
      method: "POST",
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      })
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Network response was not ok.');
    })
    .then(data => {
      showToast(`Thank you, ${nameInput.value.trim()}! Your message has been sent successfully.`);
      contactForm.reset();
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    })
    .catch(error => {
      console.error('Error sending message:', error);
      showToast('Could not send message. Please try again.', false);
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnHTML;
    });
  });

  // ==========================================================================
  // 6. PROFILE PHOTO FALLBACK
  // ==========================================================================
  const profileImg = document.querySelector('.hero-profile-img');
  const fallbackSvg = document.querySelector('.hero-profile-fallback');
  
  if (profileImg && fallbackSvg) {
    profileImg.addEventListener('error', () => {
      profileImg.style.display = 'none';
      fallbackSvg.style.display = 'block';
    });
    
    if (profileImg.complete && profileImg.naturalWidth === 0) {
      profileImg.style.display = 'none';
      fallbackSvg.style.display = 'block';
    }
  }

  // ==========================================================================
  // 7. TYPEWRITER EFFECT
  // ==========================================================================
  const typewriterElement = document.getElementById('typewriter-text');
  if (typewriterElement) {
    const roles = ["Java Developer", "Full-Stack Developer", "Front-End Developer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const type = () => {
      const currentRole = roles[roleIndex];
      if (isDeleting) {
        typewriterElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
        typingSpeed = 50;
      } else {
        typewriterElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
        typingSpeed = 100;
      }

      if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500;
      }

      setTimeout(type, typingSpeed);
    };

    setTimeout(type, 1000);
  }

  // ==========================================================================
  // 8. 3D TILT EFFECT ON PROJECTS
  // ==========================================================================
  const projectCards = document.querySelectorAll('.project-card');
  projectCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const cardRect = card.getBoundingClientRect();
      const cardWidth = cardRect.width;
      const cardHeight = cardRect.height;
      
      const x = (e.clientX - cardRect.left) / cardWidth - 0.5;
      const y = (e.clientY - cardRect.top) / cardHeight - 0.5;
      
      const maxRotateX = 10;
      const maxRotateY = 10;
      
      const rotateX = -y * maxRotateX;
      const rotateY = x * maxRotateY;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
      
      const shadowX = -x * 12;
      const shadowY = -y * 12;
      card.style.boxShadow = `${shadowX}px ${shadowY}px 25px rgba(0, 0, 0, 0.35), 0 0 20px rgba(37, 99, 235, 0.2)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      card.style.boxShadow = 'var(--shadow-sm)';
    });
  });

  // ==========================================================================
  // 9. BUTTON RIPPLE CLICK EFFECT
  // ==========================================================================
  const buttons = document.querySelectorAll('.btn');
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - this.getBoundingClientRect().left;
      const y = e.clientY - this.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // ==========================================================================
  // 10. AI CHAT ASSISTANT WIDGET (DHANUSH)
  // ==========================================================================
  const chatToggleBtn = document.getElementById('chat-toggle-btn');
  const chatCloseBtn = document.getElementById('chat-close-btn');
  const chatWindow = document.getElementById('chat-window');
  const chatMessages = document.getElementById('chat-messages');
  const chatInputForm = document.getElementById('chat-input-form');
  const chatInput = document.getElementById('chat-input');

  // Toggle chat window open/close
  if (chatToggleBtn && chatCloseBtn && chatWindow) {
    chatToggleBtn.addEventListener('click', () => {
      const isOpen = chatWindow.classList.toggle('open');
      chatWindow.setAttribute('aria-hidden', !isOpen);
      if (isOpen && chatInput) {
        chatInput.focus();
      }
    });

    chatCloseBtn.addEventListener('click', () => {
      chatWindow.classList.remove('open');
      chatWindow.setAttribute('aria-hidden', 'true');
    });

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && chatWindow.classList.contains('open')) {
        chatWindow.classList.remove('open');
        chatWindow.setAttribute('aria-hidden', 'true');
      }
    });
  }

  // Handle message processing
  if (chatInputForm && chatMessages) {
    chatInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const userText = chatInput.value.trim();
      if (!userText) return;

      // 1. Add User Message
      appendMessage(userText, 'user-msg');
      chatInput.value = '';

      // 2. Add Typing Indicator
      const typingBubble = showTypingIndicator();

      // 3. Process reply after delay
      setTimeout(() => {
        // Remove typing indicator
        typingBubble.remove();

        // Get AI response
        const aiResponse = getAIResponse(userText);
        appendMessage(aiResponse, 'ai-msg');
      }, 1000 + Math.random() * 500); // 1.0 - 1.5 second delay
    });

    function appendMessage(text, className) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `chat-msg ${className}`;
      msgDiv.innerHTML = text; // allow HTML tags for links
      chatMessages.appendChild(msgDiv);
      
      // Auto scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function showTypingIndicator() {
      const bubble = document.createElement('div');
      bubble.className = 'chat-msg ai-msg typing-bubble';
      bubble.innerHTML = `
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
        <span class="typing-dot"></span>
      `;
      chatMessages.appendChild(bubble);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return bubble;
    }

    function getAIResponse(input) {
      const cleanInput = input.toLowerCase().trim();
      
      // Greetings
      if (cleanInput.includes('hi') || cleanInput.includes('hello') || cleanInput.includes('hey') || cleanInput.includes('greetings') || cleanInput.includes('welcome') || cleanInput.includes('sup') || cleanInput.includes('yo')) {
        return "Hello! I am Dhanush. Nice to meet you! How can I help you today? Ask me about my skills, projects, education, or how to contact me.";
      }
      
      // Skills & Tech
      if (cleanInput.includes('skill') || cleanInput.includes('tech') || cleanInput.includes('languages') || cleanInput.includes('stack') || cleanInput.includes('framework') || cleanInput.includes('what do you know')) {
        return "I am a Java and Full-Stack Developer. My skills include:<br>• <strong>Backend</strong>: Java (90%), Spring Boot (85%), MySQL (80%)<br>• <strong>Frontend</strong>: HTML (85%), CSS (80%), JavaScript (75%)<br>• <strong>Tools</strong>: GitHub (85%), VS Code (90%), IntelliJ IDEA (85%)<br>Check out my percentage levels in the Skills section above!";
      }

      if (cleanInput.includes('java') || cleanInput.includes('spring') || cleanInput.includes('springboot')) {
        return "I specialize in <strong>Java</strong> and <strong>Spring Boot</strong> for developing enterprise-grade backends, RESTful APIs, and secure CRUD controllers.";
      }

      if (cleanInput.includes('database') || cleanInput.includes('mysql') || cleanInput.includes('sql')) {
        return "I use <strong>MySQL</strong> and MySQL Workbench to configure relational tables, handle transactional states, and store logs securely.";
      }

      if (cleanInput.includes('html') || cleanInput.includes('css') || cleanInput.includes('javascript') || cleanInput.includes('js') || cleanInput.includes('frontend')) {
        return "For frontend design, I build responsive, animated, and modern interfaces using semantic <strong>HTML</strong>, custom <strong>CSS</strong> variables, and native <strong>JavaScript</strong>.";
      }
      
      // Projects
      if (cleanInput.includes('project') || cleanInput.includes('portfolio') || cleanInput.includes('code') || cleanInput.includes('work') || cleanInput.includes('built') || cleanInput.includes('created')) {
        return "I have built four featured backend and full-stack projects:<br>1. <strong>Employee Payroll System</strong>: Spring Boot & MySQL CRUD system.<br>2. <strong>Banking Management System</strong>: Java Core logic storing states in MySQL.<br>3. <strong>E-Commerce Order System</strong>: Transaction validation logs using relational tables.<br>4. <strong>Student Management API</strong>: Spring Boot REST microservice.<br>You can read descriptions and see UI mockups in the Projects section above!";
      }

      if (cleanInput.includes('payroll')) {
        return "The **Employee Payroll System** is a platform configuring relational employee tables in MySQL Workbench, featuring Spring Boot backend APIs to perform employee updates, calculations, and salary logs.";
      }

      if (cleanInput.includes('bank') || cleanInput.includes('banking')) {
        return "The **Banking Management System** is a simulation written in native Java, with a MySQL backend layer handling account balances, deposits, withdrawals, and historical ledger transactions.";
      }

      if (cleanInput.includes('ecommerce') || cleanInput.includes('order')) {
        return "The **E-Commerce Order Management System** tracks transaction lifecycles, verifies product inventories, checks validation states, and logs checkout status inside MySQL persistent tables.";
      }

      if (cleanInput.includes('student') || cleanInput.includes('api')) {
        return "The **Student Management API** is a RESTful microservice built with Spring Boot, handling full CRUD operations for student records and course enrollments.";
      }
      
      // Education & College
      if (cleanInput.includes('education') || cleanInput.includes('college') || cleanInput.includes('nsn') || cleanInput.includes('degree') || cleanInput.includes('university') || cleanInput.includes('study') || cleanInput.includes('qualification')) {
        return "I completed my Bachelor of Engineering (B.E.) in <strong>Computer Science & Engineering</strong> from <strong>NSN College of Engineering and Technology</strong> (Passed out: 2026).";
      }

      if (cleanInput.includes('graduat') || cleanInput.includes('passedout') || cleanInput.includes('pass out') || cleanInput.includes('year') || cleanInput.includes('2026')) {
        return "I am a fresh graduate who passed out in the year <strong>2026</strong> with a B.E. in Computer Science & Engineering.";
      }
      
      // Experience / Fresher status
      if (cleanInput.includes('experience') || cleanInput.includes('job') || cleanInput.includes('career') || cleanInput.includes('work') || cleanInput.includes('fresher') || cleanInput.includes('intern') || cleanInput.includes('senior')) {
        return "I am a **fresh graduate (2026 passout)** eager to launch my career! Although I am a fresher, I have solid hands-on experience designing database schemas, building REST APIs, and writing full-stack code across multiple major projects.";
      }
      
      // Contact & Hire
      if (cleanInput.includes('contact') || cleanInput.includes('email') || cleanInput.includes('phone') || cleanInput.includes('reach') || cleanInput.includes('hire') || cleanInput.includes('linkedin') || cleanInput.includes('github') || cleanInput.includes('resume')) {
        return "You can get in touch with me through:<br>• **LinkedIn**: <a href='https://www.linkedin.com/in/dhanush-s' target='_blank'>linkedin.com/in/dhanush-s</a><br>• **GitHub**: <a href='https://github.com/dhanush-s' target='_blank'>github.com/dhanush-s</a><br>• **Email**: You can send me a message through the contact form on this page! You can also download my resume using the 'Download Resume' button at the top of the page.";
      }

      // Fun / Small talk
      if (cleanInput.includes('how are you') || cleanInput.includes('how\'s it going') || cleanInput.includes('how you doing')) {
        return "I am doing fantastic, thank you! I'm here ready to answer any questions you have about Dhanush S. What would you like to know?";
      }

      if (cleanInput.includes('joke') || cleanInput.includes('funny')) {
        return "Why do Java programmers wear glasses? Because they don't C#! 😄";
      }

      if (cleanInput.includes('who are you') || cleanInput.includes('what are you') || cleanInput.includes('bot') || cleanInput.includes('ai') || cleanInput.includes('assistant')) {
        return "I am Dhanush S's virtual assistant. I am built with smart logic to answer any questions you have about Dhanush's credentials, technical skills, projects, and contact channels.";
      }

      if (cleanInput.includes('thank') || cleanInput.includes('thanks') || cleanInput.includes('cool') || cleanInput.includes('awesome') || cleanInput.includes('great')) {
        return "You're very welcome! Let me know if you have any other questions about my background, skills, or projects.";
      }
      
      // General Fallback
      return "That's a great question! As Dhanush's personal assistant, I can share that Dhanush is a Java & Full-Stack Developer who graduated in 2026. He is skilled in Java, Spring Boot, MySQL, HTML, CSS, and JS, and has built 4 key projects. If your question is specific, you can fill out the contact form below or connect via <a href='https://www.linkedin.com/in/dhanush-s' target='_blank'>LinkedIn</a> to talk to him directly!";
    }
  }



  // ==========================================================================
  // 12. CHAT SHORTCUT TAGS TRIGGER (FLOATING BOT)
  // ==========================================================================
  const shortcutButtons = document.querySelectorAll('.chat-shortcut-btn');
  shortcutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const question = btn.getAttribute('data-question');
      
      // Open chatbot widget
      if (chatWindow && chatInput && chatInputForm) {
        chatWindow.classList.add('open');
        chatWindow.setAttribute('aria-hidden', 'false');
        chatInput.value = question;
        chatInput.focus();
        
        setTimeout(() => {
          chatInputForm.dispatchEvent(new Event('submit'));
        }, 300);
      }
    });
  });

  // ==========================================================================
  // 13. GSAP MOTION FOR HERO PHOTO
  // ==========================================================================
  if (typeof gsap !== 'undefined') {
    const photoWrapper = document.querySelector('.hero-image-wrapper');
    const photoCard = document.querySelector('.hero-image-card');
    const photoGlow = document.querySelector('.hero-image-decor-glow');
    const heroSection = document.getElementById('hero');

    if (photoCard) {
      // 1. Premium Intro Reveal Animation (3D slide, tilt, scale, and fade-in)
      gsap.from(photoCard, {
        opacity: 0,
        scale: 0.6,
        rotateX: -30,
        rotateY: 20,
        y: 80,
        duration: 1.8,
        ease: "power4.out"
      });

      // 2. Slow continuous floating loop on the wrapper
      if (photoWrapper) {
        gsap.to(photoWrapper, {
          y: "-=10",
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1
        });
      }

      // 3. Mousemove 3D Parallax Tilt Effect
      if (heroSection) {
        heroSection.addEventListener('mousemove', (e) => {
          const { clientX, clientY } = e;
          const { innerWidth, innerHeight } = window;
          
          // Calculate coordinates from center (-0.5 to 0.5)
          const x = (clientX / innerWidth) - 0.5;
          const y = (clientY / innerHeight) - 0.5;

          // Smoothly animate photo card to tilt rotation and small offset
          gsap.to(photoCard, {
            duration: 0.6,
            rotateY: x * 20, // max tilt Y
            rotateX: -y * 20, // max tilt X
            x: x * 15,
            y: y * 15,
            ease: "power2.out"
          });

          // Smoothly animate glow background in opposite direction (parallax)
          if (photoGlow) {
            gsap.to(photoGlow, {
              duration: 0.8,
              x: -x * 30,
              y: -y * 30,
              ease: "power2.out"
            });
          }
        });

        // Reset positions when mouse leaves the hero section
        heroSection.addEventListener('mouseleave', () => {
          gsap.to(photoCard, {
            duration: 1.2,
            rotateY: 0,
            rotateX: 0,
            x: 0,
            y: 0,
            ease: "power3.out"
          });

          if (photoGlow) {
            gsap.to(photoGlow, {
              duration: 1.2,
              x: 0,
              y: 0,
              ease: "power3.out"
            });
          }
        });
      }
    }
  }
});
