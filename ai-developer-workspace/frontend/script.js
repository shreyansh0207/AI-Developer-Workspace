const API_URL = "http://127.0.0.1:8000/api/ai";


const toolContainer =
    document.getElementById("toolContainer");

const pageTitle =
    document.getElementById("pageTitle");

const pageSubtitle =
    document.getElementById("pageSubtitle");

const provider =
    document.getElementById("provider");

const output =
    document.getElementById("output");

const outputTitle =
    document.getElementById("outputTitle");

const copyBtn =
    document.getElementById("copyBtn");

const downloadBtn =
    document.getElementById("downloadBtn");

const toast =
    document.getElementById("toast");


let currentTool = "generate";

let latestResponse = "";

let thinkingTimer = null;

let thinkingIndex = 0;


/*
    Keep the state of every tool.
*/

const toolState = {

    generate: {
        prompt: "",
        language: "javascript",
        response: ""
    },

    explain: {
        prompt: "",
        code: "",
        response: ""
    },

    debug: {
        prompt: "",
        code: "",
        response: ""
    },

    improve: {
        prompt: "",
        code: "",
        response: ""
    },

    convert: {
        code: "",
        fromLanguage: "javascript",
        toLanguage: "python",
        response: ""
    },

    docs: {
        code: "",
        docType: "README",
        response: ""
    }

};


/* =====================================================
   TOOL DATA
===================================================== */

const toolData = {

    generate: {

        title: "Generate Code",

        subtitle:
            "Describe what you want to build and let AI write it for you.",

        output:
            "Generated response"

    },

    explain: {

        title: "Explain Code",

        subtitle:
            "Paste your code and get a clear explanation from the AI.",

        output:
            "Code explanation"

    },

    debug: {

        title: "Debug Code",

        subtitle:
            "Find errors, understand the problem, and get corrected code.",

        output:
            "Debug result"

    },

    improve: {

        title: "Improve Code",

        subtitle:
            "Refactor your code and make it cleaner and easier to maintain.",

        output:
            "Improved code"

    },

    convert: {

        title: "Convert Code",

        subtitle:
            "Convert your code into another programming language.",

        output:
            "Converted code"

    },

    docs: {

        title: "Documentation",

        subtitle:
            "Create clean and professional documentation for your code.",

        output:
            "Generated documentation"

    }

};


/* =====================================================
   TOOL HTML
===================================================== */

function getToolHTML(tool) {

    if (tool === "generate") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            YOUR REQUEST
                        </span>

                        <h3>
                            What do you want to build?
                        </h3>

                    </div>

                </div>


                <textarea
                    id="promptInput"
                    class="prompt-input"
                    placeholder="Example: Create a JavaScript calculator with addition, subtraction, multiplication and division..."
                ></textarea>


                <div class="card-footer">

                    <div class="language-control">

                        <span>
                            Language
                        </span>

                        <select id="language">

                            <option value="javascript">
                                JavaScript
                            </option>

                            <option value="python">
                                Python
                            </option>

                            <option value="typescript">
                                TypeScript
                            </option>

                            <option value="java">
                                Java
                            </option>

                            <option value="cpp">
                                C++
                            </option>

                            <option value="sql">
                                SQL
                            </option>

                        </select>

                    </div>


                    <button
                        id="actionBtn"
                        class="primary-btn"
                    >
                        ⚡ Generate Code
                    </button>

                </div>

            </section>

        `;

    }


    if (tool === "explain") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            CODE TO EXPLAIN
                        </span>

                        <h3>
                            Paste your code here
                        </h3>

                    </div>


                    <button
                        id="clearCode"
                        class="secondary-btn"
                    >
                        Clear
                    </button>

                </div>


                <textarea
                    id="codeInput"
                    class="code-input"
                    placeholder="// Paste the code you want to understand here..."
                ></textarea>

            </section>


            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            OPTIONAL INSTRUCTION
                        </span>

                        <h3>
                            What should I focus on?
                        </h3>

                    </div>

                </div>


                <textarea
                    id="promptInput"
                    class="prompt-input small"
                    placeholder="Example: Explain this code line by line..."
                ></textarea>


                <div class="card-footer">

                    <span class="helper-text">
                        You can leave this empty for a general explanation.
                    </span>


                    <button
                        id="actionBtn"
                        class="primary-btn"
                    >
                        💡 Explain Code
                    </button>

                </div>

            </section>

        `;

    }


    if (tool === "debug") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            CODE TO DEBUG
                        </span>

                        <h3>
                            Paste your code here
                        </h3>

                    </div>


                    <button
                        id="clearCode"
                        class="secondary-btn"
                    >
                        Clear
                    </button>

                </div>


                <textarea
                    id="codeInput"
                    class="code-input"
                    placeholder="// Paste the code that is causing the problem..."
                ></textarea>

            </section>


            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            ERROR / PROBLEM
                        </span>

                        <h3>
                            What is going wrong?
                        </h3>

                    </div>

                </div>


                <textarea
                    id="promptInput"
                    class="prompt-input small"
                    placeholder="Example: TypeError: Cannot read properties of undefined..."
                ></textarea>


                <div class="card-footer">

                    <span class="helper-text">
                        Include the error message if you have one.
                    </span>


                    <button
                        id="actionBtn"
                        class="primary-btn"
                    >
                        🐛 Debug Code
                    </button>

                </div>

            </section>

        `;

    }


    if (tool === "improve") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            CODE TO IMPROVE
                        </span>

                        <h3>
                            Paste your code here
                        </h3>

                    </div>


                    <button
                        id="clearCode"
                        class="secondary-btn"
                    >
                        Clear
                    </button>

                </div>


                <textarea
                    id="codeInput"
                    class="code-input"
                    placeholder="// Paste the code you want to improve..."
                ></textarea>

            </section>


            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            IMPROVEMENT REQUEST
                        </span>

                        <h3>
                            How should it be improved?
                        </h3>

                    </div>

                </div>


                <textarea
                    id="promptInput"
                    class="prompt-input small"
                    placeholder="Example: Make it cleaner and improve error handling..."
                ></textarea>


                <div class="card-footer">

                    <span class="helper-text">
                        Leave empty for general improvements.
                    </span>


                    <button
                        id="actionBtn"
                        class="primary-btn"
                    >
                        ✨ Improve Code
                    </button>

                </div>

            </section>

        `;

    }


    if (tool === "convert") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            SOURCE CODE
                        </span>

                        <h3>
                            Paste your code here
                        </h3>

                    </div>


                    <button
                        id="clearCode"
                        class="secondary-btn"
                    >
                        Clear
                    </button>

                </div>


                <textarea
                    id="codeInput"
                    class="code-input"
                    placeholder="// Paste the code you want to convert..."
                ></textarea>

            </section>


            <section class="tool-card">

                <div class="conversion-card">

                    <div class="conversion-row">

                        <div class="select-group">

                            <label>
                                From
                            </label>

                            <select id="fromLanguage">

                                <option value="javascript">
                                    JavaScript
                                </option>

                                <option value="python">
                                    Python
                                </option>

                                <option value="typescript">
                                    TypeScript
                                </option>

                                <option value="java">
                                    Java
                                </option>

                                <option value="cpp">
                                    C++
                                </option>

                            </select>

                        </div>


                        <div class="arrow">
                            →
                        </div>


                        <div class="select-group">

                            <label>
                                To
                            </label>

                            <select id="toLanguage">

                                <option value="python">
                                    Python
                                </option>

                                <option value="javascript">
                                    JavaScript
                                </option>

                                <option value="typescript">
                                    TypeScript
                                </option>

                                <option value="java">
                                    Java
                                </option>

                                <option value="cpp">
                                    C++
                                </option>

                            </select>

                        </div>


                        <button
                            id="actionBtn"
                            class="primary-btn"
                        >
                            🔄 Convert Code
                        </button>

                    </div>

                </div>

            </section>

        `;

    }


    if (tool === "docs") {

        return `

            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            CODE TO DOCUMENT
                        </span>

                        <h3>
                            Paste your code here
                        </h3>

                    </div>


                    <button
                        id="clearCode"
                        class="secondary-btn"
                    >
                        Clear
                    </button>

                </div>


                <textarea
                    id="codeInput"
                    class="code-input"
                    placeholder="// Paste the code you want to document..."
                ></textarea>

            </section>


            <section class="tool-card">

                <div class="card-header">

                    <div>

                        <span class="eyebrow">
                            DOCUMENTATION TYPE
                        </span>

                        <h3>
                            What should be generated?
                        </h3>

                    </div>

                </div>


                <div class="options">

                    <button
                        class="option-btn active"
                        data-doc="README"
                    >
                        README
                    </button>


                    <button
                        class="option-btn"
                        data-doc="API Documentation"
                    >
                        API Documentation
                    </button>


                    <button
                        class="option-btn"
                        data-doc="Code Comments"
                    >
                        Code Comments
                    </button>

                </div>


                <div class="card-footer">

                    <span class="helper-text">
                        Select the documentation type.
                    </span>


                    <button
                        id="actionBtn"
                        class="primary-btn"
                    >
                        📚 Generate Documentation
                    </button>

                </div>

            </section>

        `;

    }

}


/* =====================================================
   SAVE CURRENT TOOL STATE
===================================================== */

function saveCurrentState() {

    const state =
        toolState[currentTool];


    if (!state) {
        return;
    }


    const promptInput =
        document.getElementById(
            "promptInput"
        );


    const codeInput =
        document.getElementById(
            "codeInput"
        );


    const language =
        document.getElementById(
            "language"
        );


    const fromLanguage =
        document.getElementById(
            "fromLanguage"
        );


    const toLanguage =
        document.getElementById(
            "toLanguage"
        );


    if (promptInput) {

        state.prompt =
            promptInput.value;

    }


    if (codeInput) {

        state.code =
            codeInput.value;

    }


    if (language) {

        state.language =
            language.value;

    }


    if (fromLanguage) {

        state.fromLanguage =
            fromLanguage.value;

    }


    if (toLanguage) {

        state.toLanguage =
            toLanguage.value;

    }


    const selectedDoc =
        document.querySelector(
            ".option-btn.active"
        );


    if (
        selectedDoc &&
        currentTool === "docs"
    ) {

        state.docType =
            selectedDoc.dataset.doc;

    }

}


/* =====================================================
   RESTORE CURRENT TOOL STATE
===================================================== */

function restoreToolState() {

    const state =
        toolState[currentTool];


    if (!state) {
        return;
    }


    const promptInput =
        document.getElementById(
            "promptInput"
        );


    const codeInput =
        document.getElementById(
            "codeInput"
        );


    const language =
        document.getElementById(
            "language"
        );


    const fromLanguage =
        document.getElementById(
            "fromLanguage"
        );


    const toLanguage =
        document.getElementById(
            "toLanguage"
        );


    if (promptInput) {

        promptInput.value =
            state.prompt || "";

    }


    if (codeInput) {

        codeInput.value =
            state.code || "";

    }


    if (language) {

        language.value =
            state.language ||
            "javascript";

    }


    if (fromLanguage) {

        fromLanguage.value =
            state.fromLanguage ||
            "javascript";

    }


    if (toLanguage) {

        toLanguage.value =
            state.toLanguage ||
            "python";

    }


    if (
        currentTool === "docs"
    ) {

        document
            .querySelectorAll(
                ".option-btn"
            )
            .forEach(button => {

                button.classList.toggle(
                    "active",
                    button.dataset.doc ===
                    state.docType
                );

            });

    }

}


/* =====================================================
   LOAD TOOL
===================================================== */

function loadTool(tool) {

    saveCurrentState();


    currentTool = tool;


    const data =
        toolData[tool];


    pageTitle.textContent =
        data.title;


    pageSubtitle.textContent =
        data.subtitle;


    outputTitle.textContent =
        data.output;


    toolContainer.innerHTML =
        getToolHTML(tool);


    restoreToolState();


    const savedResponse =
        toolState[tool].response;


    if (savedResponse) {

        latestResponse =
            savedResponse;


        showResponse(
            savedResponse,
            false
        );

    } else {

        latestResponse =
            "";

        output.innerHTML = `

            <div class="welcome">

                <div class="welcome-icon">
                    ${getToolIcon(tool)}
                </div>

                <h3>
                    ${data.title} is ready
                </h3>

                <p>
                    ${data.subtitle}
                </p>

            </div>

        `;

    }


    setupToolEvents();

}


/* =====================================================
   ICONS
===================================================== */

function getToolIcon(tool) {

    const icons = {

        generate: "⚡",

        explain: "💡",

        debug: "🐛",

        improve: "✨",

        convert: "🔄",

        docs: "📚"

    };


    return icons[tool] || "✦";

}


/* =====================================================
   TOOL EVENTS
===================================================== */

function setupToolEvents() {

    const actionBtn =
        document.getElementById(
            "actionBtn"
        );


    if (actionBtn) {

        actionBtn.addEventListener(
            "click",
            runAI
        );

    }


    const clearCode =
        document.getElementById(
            "clearCode"
        );


    if (clearCode) {

        clearCode.addEventListener(
            "click",
            () => {

                const code =
                    document.getElementById(
                        "codeInput"
                    );


                if (code) {

                    code.value = "";

                    saveCurrentState();

                    code.focus();

                }

            }
        );

    }


    document
        .querySelectorAll(".option-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".option-btn"
                        )
                        .forEach(item => {

                            item.classList.remove(
                                "active"
                            );

                        });


                    button.classList.add(
                        "active"
                    );


                    saveCurrentState();

                }
            );

        });

}


/* =====================================================
   SIDEBAR EVENTS
===================================================== */

document
    .querySelectorAll(".tool-btn")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                document
                    .querySelectorAll(
                        ".tool-btn"
                    )
                    .forEach(item => {

                        item.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                loadTool(
                    button.dataset.tool
                );

            }
        );

    });


/* =====================================================
   RUN AI
===================================================== */

async function runAI() {

    saveCurrentState();


    const state =
        toolState[currentTool];


    let code =
        state.code || "";


    let prompt =
        state.prompt || "";


    let language =
        state.language ||
        "javascript";


    if (
        currentTool === "generate"
    ) {

        if (!prompt.trim()) {

            showToast(
                "Describe what you want to build first."
            );

            return;

        }

    } else {

        if (!code.trim()) {

            showToast(
                "Please paste your code first."
            );

            const codeInput =
                document.getElementById(
                    "codeInput"
                );


            if (codeInput) {

                codeInput.focus();

            }

            return;

        }

    }


    /* CONVERT */

    if (
        currentTool === "convert"
    ) {

        const from =
            state.fromLanguage ||
            "javascript";


        const to =
            state.toLanguage ||
            "python";


        language =
            to;


        prompt =
            `Convert this ${from} code to ${to}. Preserve the same functionality and return clean, ready-to-use code.`;

    }


    /* DOCUMENTATION */

    if (
        currentTool === "docs"
    ) {

        const type =
            state.docType ||
            "README";


        prompt =
            `Generate professional ${type} documentation for this code.`;

    }


    /* EXPLAIN */

    if (
        currentTool === "explain" &&
        !prompt.trim()
    ) {

        prompt =
            "Explain this code clearly. Explain what it does, how the important parts work, and describe the overall flow.";

    }


    /* DEBUG */

    if (
        currentTool === "debug" &&
        !prompt.trim()
    ) {

        prompt =
            "Find the problem in this code, explain why it happens, and provide corrected code.";

    }


    /* IMPROVE */

    if (
        currentTool === "improve" &&
        !prompt.trim()
    ) {

        prompt =
            "Improve this code while preserving its intended functionality. Make it cleaner, safer and easier to maintain.";

    }


    const actionButton =
        document.getElementById(
            "actionBtn"
        );


    if (actionButton) {

        actionButton.disabled =
            true;

    }


    startThinking();


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify({

                            provider:
                                provider.value,

                            action:
                                toolData[
                                    currentTool
                                ].title,

                            prompt:
                                prompt,

                            code:
                                code,

                            language:
                                language

                        })

                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                `Server error: ${response.status}`
            );

        }


        if (!data.success) {

            throw new Error(
                data.error ||
                "AI request failed."
            );

        }


        latestResponse =
            data.result;


        /*
            Save AI response.

            This is what allows the response
            to remain when switching tools.
        */

        toolState[
            currentTool
        ].response =
            data.result;


        showResponse(
            data.result,
            true
        );


    } catch (error) {

        stopThinking();


        output.innerHTML = `

            <div class="error-state">

                <div class="error-icon">
                    ⚠
                </div>

                <h3>
                    Something went wrong
                </h3>

                <p>
                    ${escapeHTML(
                        error.message
                    )}
                </p>

            </div>

        `;

    } finally {

        if (actionButton) {

            actionButton.disabled =
                false;

        }

    }

}


/* =====================================================
   THINKING ANIMATION
===================================================== */

const thinkingStages = [

    {
        title: "Thinking...",
        text: "Understanding your request"
    },

    {
        title: "Analyzing...",
        text: "Working through the problem"
    },

    {
        title: "Writing...",
        text: "Generating the solution"
    },

    {
        title: "Reviewing...",
        text: "Checking the response"
    }

];


function startThinking() {

    stopThinking();


    thinkingIndex = 0;


    renderThinking();


    thinkingTimer =
        setInterval(
            () => {

                thinkingIndex++;


                if (
                    thinkingIndex >=
                    thinkingStages.length
                ) {

                    thinkingIndex = 0;

                }


                renderThinking();

            },
            1200
        );

}


function renderThinking() {

    const stage =
        thinkingStages[
            thinkingIndex
        ];


    output.innerHTML = `

        <div class="ai-thinking">

            <div class="thinking-orb">

                <span></span>
                <span></span>
                <span></span>

            </div>


            <h3>
                ${stage.title}
            </h3>


            <p>
                ${stage.text}
            </p>


            <div class="thinking-progress">

                <div></div>

            </div>

        </div>

    `;

}


function stopThinking() {

    if (thinkingTimer) {

        clearInterval(
            thinkingTimer
        );

        thinkingTimer =
            null;

    }

}


/* =====================================================
   SHOW RESPONSE
===================================================== */

function showResponse(
    text,
    stopAnimation = true
) {

    if (stopAnimation) {

        stopThinking();

    }


    output.innerHTML = `

        <div class="response-status">

            <span class="response-check">
                ✓
            </span>

            AI response ready

        </div>


        <div class="response">
            ${escapeHTML(text)}
        </div>

    `;

}


/* =====================================================
   COPY
===================================================== */

copyBtn.addEventListener(
    "click",
    async () => {

        if (!latestResponse) {

            showToast(
                "Nothing to copy yet."
            );

            return;

        }


        try {

            await navigator.clipboard.writeText(
                latestResponse
            );


            showToast(
                "Copied to clipboard."
            );


        } catch {

            showToast(
                "Could not copy the response."
            );

        }

    }
);


/* =====================================================
   DOWNLOAD
===================================================== */

downloadBtn.addEventListener(
    "click",
    () => {

        if (!latestResponse) {

            showToast(
                "Nothing to download yet."
            );

            return;

        }


        const blob =
            new Blob(
                [latestResponse],
                {
                    type:
                        "text/plain"
                }
            );


        const url =
            URL.createObjectURL(
                blob
            );


        const link =
            document.createElement(
                "a"
            );


        link.href =
            url;


        link.download =
            "ai-developer-response.txt";


        document.body.appendChild(
            link
        );


        link.click();


        document.body.removeChild(
            link
        );


        URL.revokeObjectURL(
            url
        );


        showToast(
            "Response downloaded."
        );

    }
);


/* =====================================================
   TOAST
===================================================== */

function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2200
    );

}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeHTML(value) {

    return String(value)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


/* =====================================================
   INITIALIZE
===================================================== */

loadTool(
    "generate"
);