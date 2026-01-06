document.addEventListener("DOMContentLoaded", function () {
    // Initialize variables for speech synthesis
    const synth = window.speechSynthesis;
    synth.cancel();

    const textInput = document.getElementById("text-input");
    const voiceSelect = document.getElementById("voice-select");
    const rate = document.getElementById("rate");
    const rateValue = document.getElementById("rate-value");
    const pitch = document.getElementById("pitch");
    const pitchValue = document.getElementById("pitch-value");
    const button = document.getElementById("btn");

    let voices = [];

    // Function to populate available voices in the browser
    function populateVoices() {
        voices = synth.getVoices();
        voiceSelect.innerHTML = "";

        voices.forEach((voice) => {
            const option = document.createElement("option");
            option.textContent = `${voice.name} (${voice.lang})`;

            if (voice.default) {
                option.textContent += " [default]";
            }

            option.setAttribute("data-lang", voice.lang);
            option.setAttribute("data-name", voice.name);
            voiceSelect.appendChild(option);
        });
    }

    // Run populateVoices when voices are loaded
    populateVoices();
    if (synth.onvoiceschanged !== undefined) {
        synth.onvoiceschanged = populateVoices;
    }

    // Function to speak the text
    function speak() {
        if (synth.speaking) {
            synth.cancel();
            button.innerHTML = "Speak";
            console.error("Speech synthesis already in progress");
            return;
        }

        if (textInput.value !== "") {
            button.innerHTML = "Stop";
            const speakText = new SpeechSynthesisUtterance(textInput.value);

            // Get the selected voice
            const selectedVoice =
                voiceSelect.selectedOptions[0].getAttribute("data-name");
            voices.forEach((voice) => {
                if (voice.name === selectedVoice) {
                    speakText.voice = voice;
                }
            });

            // Set pitch and rate
            speakText.rate = rate.value;
            speakText.pitch = pitch.value;

            // Speak the text
            synth.speak(speakText);

            speakText.onend = () => {
                button.innerHTML = "Speak";
                console.log("Speech finished");
            };

            speakText.onerror = (e) => {
                console.error("Something went wrong with speech synthesis:", e);
            };
        }
    }

    // Update rate and pitch value display
    rate.addEventListener("input", () => (rateValue.textContent = rate.value));
    pitch.addEventListener("input", () => (pitchValue.textContent = pitch.value));
    btn.addEventListener("click", () => { speak() });
});