const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let currentInput = "0";
let isAiMode = false; // Interruttore segreto per l'IA

buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;

        // 1. Tasto C (Cancella tutto)
        if (value === 'C') {
            currentInput = "0";
            isAiMode = false;
            display.contentEditable = "false";
        } 
        // 2. Tasto AC (Il nostro interruttore segreto)
        else if (button.id === 'ai-toggle') {
            isAiMode = !isAiMode; // Inverte la modalità
            if (isAiMode) {
                currentInput = "AI Mode On";
                display.contentEditable = "true"; // Rende lo schermo scrivibile
            } else {
                currentInput = "0";
                display.contentEditable = "false";
            }
        } 
        // 3. Tasto = (Calcola la matematica se siamo in modalità normale)
        else if (button.id === 'equals' && !isAiMode) {
            try {
                currentInput = String(eval(currentInput));
            } catch (error) {
                currentInput = "Errore";
            }
        } 
        // 3b. Tasto = in modalità AI (chiama direttamente l'API di Gemini)
        else if (button.id === 'equals' && isAiMode) {
            const domanda = display.textContent;
            currentInput = "Sto pensando...";
            display.textContent = currentInput;

            const apiKey = "AQ.Ab8RN6JOrbrZRF9mZX4a5S94LionnoZmrcWZ6Z9_2cgQoExLWw"; // La tua chiave

            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: domanda }]
                    }]
                })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Errore HTTP: ' + response.status);
                }
                return response.json();
            })
            .then(data => {
                // Estrae la risposta di Gemini in modo sicuro
                const rispostaAI = data.candidates[0].content.parts[0].text;
                currentInput = rispostaAI;
                display.textContent = currentInput;
            })
            .catch(error => {
                console.error("Dettaglio errore:", error);
                currentInput = "Errore di connessione";
                display.textContent = currentInput;
            });
        }// 3b. Tasto = in modalità AI (chiama l'API di ChatGPT)
        else if (button.id === 'equals' && isAiMode) {
            const domanda = display.textContent;
            currentInput = "Sto pensando...";
            display.textContent = currentInput;

            // Chiamata all'API di OpenAI (ChatGPT)
            fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer LA_TUA_CHIAVE_API_QUI'
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini", // O un altro modello a tua scelta
                    messages: [{ role: "user", content: domanda }],
                    temperature: 0.7
                })
            })
            .then(response => response.json())
            .then(data => {
                // Estrae la risposta di ChatGPT e la mostra sullo schermo
                currentInput = data.choices[0].message.content;
                display.textContent = currentInput;
            })
            .catch(error => {
                currentInput = "Errore di connessione";
                display.textContent = currentInput;
            });
        }// 3b. Tasto = in modalità AI (chiama direttamente l'API di Gemini)
        else if (button.id === 'equals' && isAiMode) {
            const domanda = display.textContent;
            currentInput = "Sto pensando...";
            display.textContent = currentInput;

            const apiKey = "AQ.Ab8RN6JOrbrZRF9mZX4a5S94LionnoZmrcWZ6Z9_2cgQoExLWw"; // Sostituisci con la tua chiave

            fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: domanda }]
                    }]
                })
            })
            .then(response => response.json())
            .then(data => {
                // Estrae la risposta di Gemini
                const rispostaAI = data.candidates[0].content.parts[0].text;
                currentInput = rispostaAI;
                display.textContent = currentInput;
            })
            .catch(error => {
                currentInput = "Errore di connessione";
                display.textContent = currentInput;
            });
        }
        // 4. Scrittura normale o in modalità IA
        else if (!isAiMode) {
            if (currentInput === "0" || currentInput === "Errore") {
                currentInput = value;
            } else {
                currentInput += value;
            }
        }

        display.textContent = currentInput;
    });
});