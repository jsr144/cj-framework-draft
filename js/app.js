// Criminal Justice AI Assessment Framework - Interactive Application

document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initProhibitedScreener();
    initRiskClassification();
    initComplexityAssessment();
    initSectorTabs();
    initHelpModal();
    initSidebarToggle();
    initFormPersistence();
    initProgressTracking();
});

// Navigation Functions
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const sectionId = this.getAttribute('data-section');
            navigateTo(sectionId);
        });
    });

    // Handle hash on page load
    if (window.location.hash) {
        const sectionId = window.location.hash.substring(1);
        navigateTo(sectionId);
    }
}

function navigateTo(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.classList.remove('active'));

    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // Update navigation
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === sectionId) {
            link.classList.add('active');
        }
    });

    // Update URL
    window.history.pushState(null, '', '#' + sectionId);

    // Scroll to top
    window.scrollTo(0, 0);

    // Close sidebar on mobile
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');

    // Track progress
    trackSectionVisit(sectionId);
}

// Prohibited Use Screener
function initProhibitedScreener() {
    const form = document.getElementById('prohibitedScreener');
    if (!form) return;

    const radios = form.querySelectorAll('input[type="radio"]');
    const resultBox = document.getElementById('prohibitedResult');

    radios.forEach(radio => {
        radio.addEventListener('change', checkProhibitedStatus);
    });

    function checkProhibitedStatus() {
        const allQuestions = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'];
        let hasYes = false;
        let allAnswered = true;

        allQuestions.forEach(q => {
            const selected = form.querySelector(`input[name="${q}"]:checked`);
            if (!selected) {
                allAnswered = false;
            } else if (selected.value === 'yes') {
                hasYes = true;
            }
        });

        if (hasYes) {
            resultBox.className = 'result-box prohibited';
            resultBox.innerHTML = '<strong>PROHIBITED SYSTEM</strong><br>This system is PROHIBITED. You must stop the assessment process and proceed directly to <a href="#appendixB" onclick="navigateTo(\'appendixB\')">Appendix B: Protocol for Prohibited Systems</a>.';
            resultBox.classList.remove('hidden');
        } else if (allAnswered) {
            resultBox.className = 'result-box proceed';
            resultBox.innerHTML = '<strong>PROCEED TO NEXT STEP</strong><br>No prohibited uses identified. Continue with Step 3 to assess system complexity.';
            resultBox.classList.remove('hidden');
        }
    }
}

// Risk Classification
function initRiskClassification() {
    const form = document.getElementById('riskClassification');
    if (!form) return;

    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    const resultBox = document.getElementById('riskResult');

    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateRiskResult);
    });

    function updateRiskResult() {
        const checked = form.querySelectorAll('input[type="checkbox"]:checked').length;

        if (checked > 0) {
            resultBox.className = 'result-box substantial';
            resultBox.innerHTML = `<strong>SUBSTANTIAL RISK</strong><br>${checked} risk factor(s) identified. This system is likely SUBSTANTIAL RISK and requires Level 1 AND Level 2 safeguards.`;
        } else {
            resultBox.className = 'result-box low';
            resultBox.innerHTML = '<strong>LOW RISK</strong><br>No substantial risk factors identified. This system may qualify for Level 1 safeguards only.';
        }
    }
}

// Complexity Assessment
function initComplexityAssessment() {
    const form = document.getElementById('complexityForm');
    if (!form) return;

    const radios = form.querySelectorAll('input[type="radio"]');
    const resultBox = document.getElementById('complexityResult');

    radios.forEach(radio => {
        radio.addEventListener('change', updateComplexityResult);
    });

    function updateComplexityResult() {
        const questions = ['cq1', 'cq2', 'cq3', 'cq4', 'cq5'];
        let score = 0;
        let answered = 0;

        questions.forEach(q => {
            const selected = form.querySelector(`input[name="${q}"]:checked`);
            if (selected) {
                answered++;
                // Score complexity (higher = more complex)
                if (q === 'cq3' || q === 'cq5') {
                    // For these questions, "yes" means more complex
                    if (selected.value === 'yes') score += 2;
                    else if (selected.value === 'partial') score += 1;
                } else {
                    // For other questions, "no" means more complex
                    if (selected.value === 'no') score += 2;
                    else if (selected.value === 'partial') score += 1;
                }
            }
        });

        if (answered === questions.length) {
            if (score >= 6) {
                resultBox.className = 'result-box substantial';
                resultBox.innerHTML = '<strong>HIGH COMPLEXITY</strong><br>This system has high complexity characteristics. Enhanced oversight, explainability requirements, continuous monitoring, and independent technical validation are required.';
            } else if (score >= 3) {
                resultBox.className = 'result-box';
                resultBox.style.background = '#fff8e6';
                resultBox.style.border = '2px solid #ffc107';
                resultBox.innerHTML = '<strong>MEDIUM COMPLEXITY</strong><br>This system has moderate complexity. Standard oversight with some enhanced monitoring may be appropriate.';
            } else {
                resultBox.className = 'result-box low';
                resultBox.innerHTML = '<strong>LOW COMPLEXITY</strong><br>This system has relatively low complexity. Standard oversight approaches are likely sufficient.';
            }
        }
    }
}

// Sector Tabs
function initSectorTabs() {
    // Sector tab functionality is handled inline but we can enhance it
    window.showSector = function(sectorId) {
        // Hide all sector content
        const contents = document.querySelectorAll('.sector-content');
        contents.forEach(c => c.classList.remove('active'));

        // Show selected sector
        const target = document.getElementById(sectorId);
        if (target) {
            target.classList.add('active');
        }

        // Update tab styles
        const tabs = document.querySelectorAll('.sector-tab');
        tabs.forEach(tab => {
            tab.classList.remove('active');
            if (tab.getAttribute('onclick').includes(sectorId)) {
                tab.classList.add('active');
            }
        });
    };
}

// Help Modal
function initHelpModal() {
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');

    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', function() {
            helpModal.classList.remove('hidden');
        });

        if (closeHelp) {
            closeHelp.addEventListener('click', function() {
                helpModal.classList.add('hidden');
            });
        }

        helpModal.addEventListener('click', function(e) {
            if (e.target === helpModal) {
                helpModal.classList.add('hidden');
            }
        });
    }
}

// Sidebar Toggle (Mobile)
function initSidebarToggle() {
    const toggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');

    if (toggle && sidebar) {
        toggle.addEventListener('click', function() {
            sidebar.classList.toggle('open');
        });
    }
}

// Form Persistence
function initFormPersistence() {
    // Load saved data on page load
    loadAllFormData();

    // Auto-save on input change
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('change', function() {
                saveFormData(form.id);
            });
        });
    });
}

function saveFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const formData = new FormData(form);
    const data = {};

    formData.forEach((value, key) => {
        data[key] = value;
    });

    // Also save checkbox states
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((cb, index) => {
        data[`checkbox_${index}`] = cb.checked;
    });

    localStorage.setItem(`cj_ai_framework_${formId}`, JSON.stringify(data));

    // Show brief save confirmation
    showNotification('Progress saved');
}

function loadAllFormData() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        loadFormData(form.id);
    });
}

function loadFormData(formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    const saved = localStorage.getItem(`cj_ai_framework_${formId}`);
    if (!saved) return;

    try {
        const data = JSON.parse(saved);

        Object.keys(data).forEach(key => {
            if (key.startsWith('checkbox_')) {
                const index = parseInt(key.replace('checkbox_', ''));
                const checkboxes = form.querySelectorAll('input[type="checkbox"]');
                if (checkboxes[index]) {
                    checkboxes[index].checked = data[key];
                }
            } else {
                const element = form.querySelector(`[name="${key}"]`);
                if (element) {
                    if (element.type === 'radio') {
                        const radio = form.querySelector(`[name="${key}"][value="${data[key]}"]`);
                        if (radio) radio.checked = true;
                    } else if (element.type === 'checkbox') {
                        element.checked = data[key] === 'on' || data[key] === true;
                    } else {
                        element.value = data[key];
                    }
                }
            }
        });
    } catch (e) {
        console.error('Error loading form data:', e);
    }
}

// Progress Tracking
function initProgressTracking() {
    updateProgressBar();
}

function trackSectionVisit(sectionId) {
    const visited = JSON.parse(localStorage.getItem('cj_ai_framework_visited') || '[]');
    if (!visited.includes(sectionId)) {
        visited.push(sectionId);
        localStorage.setItem('cj_ai_framework_visited', JSON.stringify(visited));
    }
    updateProgressBar();
    updateNavCompletion();
}

function updateProgressBar() {
    const allSections = ['home', 'takeaways', 'phase1', 'phase2', 'phase3', 'phase4', 'phase5'];
    const visited = JSON.parse(localStorage.getItem('cj_ai_framework_visited') || '[]');

    const mainProgress = allSections.filter(s => visited.includes(s)).length;
    const percentage = Math.round((mainProgress / allSections.length) * 100);

    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    if (progressBar) {
        progressBar.style.setProperty('--progress', percentage + '%');
    }
    if (progressText) {
        progressText.textContent = percentage + '% Complete';
    }
}

function updateNavCompletion() {
    const visited = JSON.parse(localStorage.getItem('cj_ai_framework_visited') || '[]');
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const section = link.getAttribute('data-section');
        if (visited.includes(section)) {
            link.classList.add('completed');
        }
    });
}

// Notification Helper
function showNotification(message) {
    // Create notification element
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #28a745;
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 3000;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(notification);
    }

    notification.textContent = message;
    notification.style.opacity = '1';

    setTimeout(() => {
        notification.style.opacity = '0';
    }, 2000);
}

// Expose navigateTo globally for inline onclick handlers
window.navigateTo = navigateTo;
window.saveFormData = saveFormData;
window.showSector = showSector;
