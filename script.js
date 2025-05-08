document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const passwordEl = document.getElementById('password');
    const copyBtn = document.getElementById('copy-btn');
    const lengthEl = document.getElementById('length');
    const lengthValueEl = document.getElementById('length-value');
    const uppercaseEl = document.getElementById('uppercase');
    const lowercaseEl = document.getElementById('lowercase');
    const numbersEl = document.getElementById('numbers');
    const symbolsEl = document.getElementById('symbols');
    const generateBtn = document.getElementById('generate-btn');
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');
    
    // Character sets
    const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const symbolChars = '!@#$%^&*()_+~`|}{[]\\:;?><,./-=';
    
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
    
    // Update length display
    lengthEl.addEventListener('input', function() {
        lengthValueEl.textContent = this.value;
    });
    
    // Generate password
    generateBtn.addEventListener('click', function() {
        const length = +lengthEl.value;
        const hasUpper = uppercaseEl.checked;
        const hasLower = lowercaseEl.checked;
        const hasNumber = numbersEl.checked;
        const hasSymbol = symbolsEl.checked;
        
        passwordEl.value = generatePassword(length, hasUpper, hasLower, hasNumber, hasSymbol);
        updateStrengthIndicator(passwordEl.value);
    });
    
    // Copy password to clipboard
    copyBtn.addEventListener('click', function() {
        if (!passwordEl.value) return;
        
        passwordEl.select();
        document.execCommand('copy');
        
        // Show tooltip
        const tooltip = document.createElement('span');
        tooltip.className = 'tooltiptext';
        tooltip.textContent = 'Copied!';
        this.appendChild(tooltip);
        
        setTimeout(() => {
            tooltip.remove();
        }, 2000);
    });
    
    // Toggle theme
    themeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    // Generate password function
    function generatePassword(length, upper, lower, number, symbol) {
        let generatedPassword = '';
        const typesCount = upper + lower + number + symbol;
        
        if (typesCount === 0) {
            alert('Please select at least one character type');
            return '';
        }
        
        const typesArr = [{upper}, {lower}, {number}, {symbol}].filter(item => Object.values(item)[0]);
        
        for (let i = 0; i < length; i++) {
            const type = typesArr[Math.floor(Math.random() * typesArr.length)];
            const funcName = Object.keys(type)[0];
            generatedPassword += randomChar(funcName);
        }
        
        return shuffleString(generatedPassword);
    }
    
    // Get random character from selected character set
    function randomChar(type) {
        switch(type) {
            case 'upper':
                return uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)];
            case 'lower':
                return lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)];
            case 'number':
                return numberChars[Math.floor(Math.random() * numberChars.length)];
            case 'symbol':
                return symbolChars[Math.floor(Math.random() * symbolChars.length)];
            default:
                return '';
        }
    }
    
    // Shuffle string to make password more random
    function shuffleString(str) {
        const arr = str.split('');
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr.join('');
    }
    
    // Update password strength indicator
    function updateStrengthIndicator(password) {
        if (!password) return;
        
        // Calculate strength (simple version)
        let strength = 0;
        const length = password.length;
        
        // Length contributes up to 50% of strength
        strength += Math.min(length / 32 * 50, 50);
        
        // Character variety contributes the rest
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        const varietyCount = hasUpper + hasLower + hasNumber + hasSymbol;
        strength += (varietyCount / 4) * 50;
        
        // Update UI
        const strengthBarElement = strengthBar.querySelector('::after') || 
                                 document.createElement('div');
        
        strengthBarElement.style.width = `${strength}%`;
        
        if (strength < 40) {
            strengthBarElement.style.backgroundColor = 'var(--strength-weak)';
            strengthText.textContent = 'Strength: Weak';
        } else if (strength < 70) {
            strengthBarElement.style.backgroundColor = 'var(--strength-medium)';
            strengthText.textContent = 'Strength: Medium';
        } else {
            strengthBarElement.style.backgroundColor = 'var(--strength-strong)';
            strengthText.textContent = 'Strength: Strong';
        }
        
        if (!strengthBar.querySelector('::after')) {
            strengthBar.appendChild(strengthBarElement);
        }
    }
    
    //light and dark theme toggle
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // Generate initial password
    generateBtn.click();
});