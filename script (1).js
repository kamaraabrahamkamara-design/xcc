/**
 * Google AI Mode Preview - Application Logic Engine
 * Handles UI interactions, message processing, and multi-modal state simulation.
 */

document.addEventListener('DOMContentLoaded', () => {
    // DOM Element Selectors
    const chatHistory = document.getElementById('chatHistory');
    const chatForm = document.getElementById('chatForm');
    const userInput = document.getElementById('userInput');
    const modeIndicator = document.getElementById('modeIndicator');
    const attachmentBtn = document.getElementById('attachmentBtn');
    const micBtn = document.getElementById('micBtn');

    // Application State Variables
    let isProcessing = false;
    let selectedMode = 'text'; // 'text', 'voice', 'vision'

    // Mock Responses mapping keywords to specific outcomes
    const mockResponses = {
        greeting: "Hello! I am Google AI Mode. I can process text, images, or voice inputs to help solve your complex tasks. How can I assist you today?",
        default: "I've analyzed your request using my multi-step logic framework. I broke this down into subqueries, validated the sources, and compiled this structured synthesis for you.",
        vision: "Image analysis complete. I have identified the primary objects and text within your upload and integrated them into our conversation context.",
        voice: "Audio transcription finished. Processing your spoken query with the same depth as a standard textual entry."
    };

    /**
     * Initializes the chat application behavior
     */
    function init() {
        setupEventListeners();
        showInitialMessage();
    }

    /**
     * Binds application interactions to DOM elements
     */
    function setupEventListeners() {
        chatForm.addEventListener('submit', handleFormSubmit);
        userInput.addEventListener('input', adjustInputHeight);

        // Simulation for Multi-modal inputs
        if (attachmentBtn) {
            attachmentBtn.addEventListener('click', simulateImageUpload);
        }
        if (micBtn) {
            micBtn.addEventListener('click', toggleVoiceInput);
        }
    }

    /**
     * Appends an initial welcoming greeting to the interface
     */
    function showInitialMessage() {
        appendMessage(mockResponses.greeting, 'ai');
    }

    /**
     * Manages form submission workflow
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const messageText = userInput.value.trim();
        if (!messageText || isProcessing) return;

        // Reset state and clear input field
        userInput.value = '';
        userInput.style.height = 'auto';
        
        // Append user prompt
        appendMessage(messageText, 'user');
        
        // Trigger simulated engine response
        processAiResponse(messageText);
    }

    /**
     * Generates a new message element inside the DOM history layout
     * @param {string} text - Message text content
     * @param {'user'|'ai'} sender - The party responsible for the message
     */
    function appendMessage(text, sender) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', sender);

        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble');
        
        // Simple paragraph wrapper for formatting
        const textParagraph = document.createElement('p');
        textParagraph.textContent = text;
        messageBubble.appendChild(textParagraph);
        
        messageWrapper.appendChild(messageBubble);
        chatHistory.appendChild(messageWrapper);
        
        // Smoothly shift layout focus to newest addition
        scrollToBottom();
    }

    /**
     * Creates a temporary placeholder UI component to indicate AI text generation
     * @returns {HTMLElement} The typing indicator DOM element
     */
    function createTypingIndicator() {
        const indicatorWrapper = document.createElement('div');
        indicatorWrapper.classList.add('message-wrapper', 'ai', 'typing-indicator-wrapper');

        const bubble = document.createElement('div');
        bubble.classList.add('message-bubble', 'typing-placeholder');
        
        // Simple ellipsis animation placeholder text
        bubble.textContent = 'AI is thinking...';
        
        indicatorWrapper.appendChild(bubble);
        chatHistory.appendChild(indicatorWrapper);
        scrollToBottom();
        
        return indicatorWrapper;
    }

    /**
     * Processes input string parameters to simulate asynchronous backend model evaluation
     * @param {string} inputQuery - Pure text query sent by the user
     */
    function processAiResponse(inputQuery) {
        setProcessingState(true);
        const indicator = createTypingIndicator();

        // Simulate network roundtrip delay (1.5 seconds)
        setTimeout(() => {
            indicator.remove();
            
            let finalResponseText = mockResponses.default;
            const cleanQuery = inputQuery.toLowerCase();

            if (cleanQuery.includes('hello') || cleanQuery.includes('hi')) {
                finalResponseText = mockResponses.greeting;
            } else if (selectedMode === 'vision') {
                finalResponseText = mockResponses.vision;
                resetInputMode();
            } else if (selectedMode === 'voice') {
                finalResponseText = mockResponses.voice;
                resetInputMode();
            }

            appendMessage(finalResponseText, 'ai');
            setProcessingState(false);
        }, 1500);
    }

    /**
     * Toggles processing state locks to prevent rapid input double-submissions
     * @param {boolean} processingState 
     */
    function setProcessingState(processingState) {
        isProcessing = processingState;
        if (userInput) userInput.disabled = processingState;
        
        const submitBtn = chatForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = processingState;
    }

    /**
     * Simulates image file drop/selection behaviors for multimodal workflows
     */
    function simulateImageUpload() {
        if (isProcessing) return;
        selectedMode = 'vision';
        updateModeUI('Vision Mode Enabled (Simulated Image Uploaded)');
    }

    /**
     * Toggles microphone system configurations for hands-free queries
     */
    function toggleVoiceInput() {
        if (isProcessing) return;
        if (selectedMode === 'voice') {
            resetInputMode();
        } else {
            selectedMode = 'voice';
            updateModeUI('Voice Mode Enabled (Listening...)');
        }
    }

    /**
     * Resets input variables and tracking flags back to default parameters
     */
    function resetInputMode() {
        selectedMode = 'text';
        updateModeUI('Text Mode');
    }

    /**
     * Updates text feedback fields across global wrappers
     * @param {string} textStatus 
     */
    function updateModeUI(textStatus) {
        if (modeIndicator) {
            modeIndicator.textContent = textStatus;
        }
    }

    /**
     * Automatically scales textarea inputs to prevent vertical scroll bars from compressing viewspaces
     */
    function adjustInputHeight() {
        userInput.style.height = 'auto';
        userInput.style.height = `${userInput.scrollHeight}px`;
    }

    /**
     * Scrolls the chat feed wrapper down to ensure new messages are visible
     */
    function scrollToBottom() {
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Launch Application
    init();
});