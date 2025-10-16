document.addEventListener('DOMContentLoaded', () => {
    const level1Btn = document.getElementById('level1-btn');
    const level2Btn = document.getElementById('level2-btn');
    const questionElement = document.getElementById('question');
    const answerInput = document.getElementById('answer-input');
    const virtualKeyboard = document.getElementById('virtual-keyboard');
    const submitBtn = document.getElementById('submit-btn');
    const feedbackElement = document.getElementById('feedback');
    const scoreElement = document.getElementById('score');

    let currentLevel = 1;
    let score = 0;
    let currentQuestion = {};

    const keyboardLayout = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        ['+', '-', '*', '/', '^', '(', ')', ' ', 'Del', 'Clear']
    ];

    function createKeyboard() {
        virtualKeyboard.innerHTML = '';
        keyboardLayout.forEach(row => {
            row.forEach(key => {
                const button = document.createElement('button');
                button.textContent = key;
                button.addEventListener('click', () => handleKeyPress(key));
                virtualKeyboard.appendChild(button);
            });
        });
    }

    function handleKeyPress(key) {
        if (key === 'Del') {
            answerInput.value = answerInput.value.slice(0, -1);
        } else if (key === 'Clear') {
            answerInput.value = '';
        } else {
            answerInput.value += key;
        }
    }

    function generateLevel1Question() {
        const var1 = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        const var2 = String.fromCharCode(97 + Math.floor(Math.random() * 26)); // a-z
        const num1 = Math.floor(Math.random() * 10) + 1; // 1-10
        const num2 = Math.floor(Math.random() * 10) + 1; // 1-10
        const num3 = Math.floor(Math.random() * 10) + 1; // 1-10

        const types = [
            () => { // v + v + v
                const v = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                return { question: `${v} + ${v} + ${v}`, answer: `3${v}` };
            },
            () => { // 2b - b + b
                const b = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const coeff1 = Math.floor(Math.random() * 5) + 2; // 2-6
                const coeff2 = Math.floor(Math.random() * (coeff1 - 1)) + 1; // 1 to coeff1-1
                const coeff3 = Math.floor(Math.random() * 5) + 1; // 1-5
                return { question: `${coeff1}${b} - ${coeff2}${b} + ${coeff3}${b}`, answer: `${coeff1 - coeff2 + coeff3}${b}` };
            },
            () => { // 7 + 3a - 4a - 2a
                const a = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 10) + 1;
                const c2 = Math.floor(Math.random() * 5) + 1;
                const c3 = Math.floor(Math.random() * 5) + 1;
                const c4 = Math.floor(Math.random() * 5) + 1;
                const ansCoeff = c2 - c3 - c4;
                const ansVar = ansCoeff === 0 ? '' : `${ansCoeff}${a}`;
                const ansConst = c1;
                let answer = '';
                if (ansVar && ansConst) {
                    answer = ansCoeff > 0 ? `${ansConst}+${ansVar}` : `${ansConst}${ansVar}`;
                } else if (ansVar) {
                    answer = ansVar;
                } else {
                    answer = `${ansConst}`;
                }
                return { question: `${c1} + ${c2}${a} - ${c3}${a} - ${c4}${a}`, answer: answer };
            },
            () => { // 5 + d + 3 - 2d
                const d = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 10) + 1;
                const c2 = Math.floor(Math.random() * 5) + 1;
                const c3 = Math.floor(Math.random() * 10) + 1;
                const c4 = Math.floor(Math.random() * 5) + 1;
                const ansConst = c1 + c3;
                const ansCoeff = c2 - c4;
                const ansVar = ansCoeff === 0 ? '' : `${ansCoeff}${d}`;
                let answer = '';
                if (ansVar && ansConst) {
                    answer = ansCoeff > 0 ? `${ansConst}+${ansVar}` : `${ansConst}${ansVar}`;
                } else if (ansVar) {
                    answer = ansVar;
                } else {
                    answer = `${ansConst}`;
                }
                return { question: `${c1} + ${c2}${d} + ${c3} - ${c4}${d}`, answer: answer };
            },
            () => { // -b + 2c + 3b + c
                const b = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                let c;
                do {
                    c = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                } while (c === b);

                const bCoeff1 = Math.floor(Math.random() * 5) + 1;
                const cCoeff1 = Math.floor(Math.random() * 5) + 1;
                const bCoeff2 = Math.floor(Math.random() * 5) + 1;
                const cCoeff2 = Math.floor(Math.random() * 5) + 1;

                const finalBCoeff = -bCoeff1 + bCoeff2;
                const finalCCoeff = cCoeff1 + cCoeff2;

                let question = `-${bCoeff1}${b} + ${cCoeff1}${c} + ${bCoeff2}${b} + ${cCoeff2}${c}`;
                let answer = '';

                if (finalBCoeff !== 0) {
                    answer += `${finalBCoeff}${b}`;
                }
                if (finalCCoeff !== 0) {
                    if (answer && finalCCoeff > 0) answer += '+';
                    answer += `${finalCCoeff}${c}`;
                }
                return { question, answer };
            },
            () => { // 4r + 2 - (2r - 3r)
                const r = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = Math.floor(Math.random() * 10) + 1;
                const c3 = Math.floor(Math.random() * 5) + 1;
                const c4 = Math.floor(Math.random() * 5) + 1;

                const insideParenCoeff = c3 - c4;
                const finalRCoeff = c1 - (insideParenCoeff);

                let question = `${c1}${r} + ${c2} - (${c3}${r} - ${c4}${r})`; // Example: 4r + 2 - (2r - 3r)
                let answer = '';

                if (finalRCoeff !== 0) {
                    answer += `${finalRCoeff}${r}`;
                }
                if (c2 !== 0) {
                    if (answer && c2 > 0) answer += '+';
                    answer += `${c2}`;
                }
                return { question, answer };
            },
            () => { // 4p - 10p ÷ 2
                const p = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = (Math.floor(Math.random() * 5) + 1) * 2; // Ensure divisibility by 2
                const c3 = 2;

                const finalPCoeff = c1 - (c2 / c3);
                return { question: `${c1}${p} - ${c2}${p} ÷ ${c3}`, answer: `${finalPCoeff}${p}` };
            },
            () => { // 6a ÷ 3 - 9a ÷ 3
                const a = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = (Math.floor(Math.random() * 5) + 1) * 3;
                const c2 = 3;
                const c3 = (Math.floor(Math.random() * 5) + 1) * 3;
                const c4 = 3;

                const finalACoeff = (c1 / c2) - (c3 / c4);
                return { question: `${c1}${a} ÷ ${c2} - ${c3}${a} ÷ ${c4}`, answer: `${finalACoeff}${a}` };
            },
            () => { // 8m + 4 + 3m × 2
                const m = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = Math.floor(Math.random() * 10) + 1;
                const c3 = Math.floor(Math.random() * 5) + 1;
                const c4 = 2;

                const finalMCoeff = c1 + (c3 * c4);
                let answer = '';
                if (finalMCoeff !== 0) {
                    answer += `${finalMCoeff}${m}`;
                }
                if (c2 !== 0) {
                    if (answer && c2 > 0) answer += '+';
                    answer += `${c2}`;
                }
                return { question: `${c1}${m} + ${c2} + ${c3}${m} × ${c4}`, answer: answer };
            },
            () => { // i × (-i) × 2i (complex numbers, simplified to variables for this context)

                const iVar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const coeff = Math.floor(Math.random() * 5) + 1; // 1-5
                return { question: `${iVar} × (-${iVar}) × ${coeff}${iVar}`, answer: `-${coeff}${iVar}^3` };
            },
            () => { // 2p × 3p × p × 4
                const pVar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const coeff1 = Math.floor(Math.random() * 3) + 1;
                const coeff2 = Math.floor(Math.random() * 3) + 1;
                const coeff3 = Math.floor(Math.random() * 3) + 1;
                const coeff4 = Math.floor(Math.random() * 3) + 1;
                const finalCoeff = coeff1 * coeff2 * coeff3 * coeff4;
                return { question: `${coeff1}${pVar} × ${coeff2}${pVar} × ${coeff3}${pVar} × ${coeff4}`, answer: `${finalCoeff}${pVar}^3` };
            },
            () => { // h × 3h × 3k × k
                const h = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                let k;
                do {
                    k = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                } while (k === h);

                const hCoeff = Math.floor(Math.random() * 3) + 1;
                const kCoeff = Math.floor(Math.random() * 3) + 1;

                return { question: `${h} × ${hCoeff}${h} × ${kCoeff}${k} × ${k}`, answer: `${hCoeff * kCoeff}${h}^2${k}^2` };
            }
        ];
        return types[Math.floor(Math.random() * types.length)]();
    }

    function generateLevel2Question() {
        const varX = 'x';
        const varV = 'v';
        const varK = 'k';
        const varB = 'b';
        const varP = 'p';
        const varC = 'c';
        const varD = 'd';

        const types = [
            () => { // (x+x) x (x x x x x)
                const x = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const numX = Math.floor(Math.random() * 3) + 2; // 2-4
               return { question: `(${x}+${x}) × (${x} ${'×'.repeat(numX - 1)} ${x})`, answer: `2${x}^${numX + 1}` };            },
            () => { // 4v - (3v-8v) ÷ 5
                const v = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = Math.floor(Math.random() * 5) + 1;
                const c3 = Math.floor(Math.random() * 5) + 1;
                const divisor = Math.floor(Math.random() * 3) + 2; // 2-4
                const insideParen = c2 - c3;
                const finalCoeff = c1 - (insideParen / divisor);
                return { question: `${c1}${v} - (${c2}${v}-${c3}${v}) ÷ ${divisor}`, answer: `${finalCoeff}${v}` };
            },
            () => { // 2k × (-3) - 8k ÷ 4
                const k = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = Math.floor(Math.random() * 5) + 1;
                const c3 = (Math.floor(Math.random() * 5) + 1) * 2; // Ensure divisibility by 2 or 4
                const c4 = 4;

                const term1 = c1 * (-c2);
                const term2 = -(c3 / c4);
                const finalCoeff = term1 + term2;
                return { question: `${c1}${k} × (-${c2}) - ${c3}${k} ÷ ${c4}`, answer: `${finalCoeff}${k}` };
            },
            () => { // 15-6b÷2+3+2b
                const b = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 10) + 1;
                const c2 = (Math.floor(Math.random() * 5) + 1) * 2;
                const c3 = 2;
                const c4 = Math.floor(Math.random() * 10) + 1;
                const c5 = Math.floor(Math.random() * 5) + 1;

                const finalConst = c1 + c4;
                const finalBCoeff = -(c2 / c3) + c5;

                let answer = '';
                if (finalBCoeff !== 0) {
                    answer += `${finalBCoeff}${b}`;
                }
                if (finalConst !== 0) {
                    if (answer && finalConst > 0) answer += '+';
                    answer += `${finalConst}`;
                }
                return { question: `${c1}-${c2}${b}÷${c3}+${c4}+${c5}${b}`, answer: answer };
            },
            () => { // 2p+4p÷2-p+4
                const p = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = (Math.floor(Math.random() * 5) + 1) * 2;
                const c3 = 2;
                const c4 = Math.floor(Math.random() * 5) + 1;
                const c5 = Math.floor(Math.random() * 10) + 1;

                const finalPCoeff = c1 + (c2 / c3) - c4;
                const finalConst = c5;

                let answer = '';
                if (finalPCoeff !== 0) {
                    answer += `${finalPCoeff}${p}`;
                }
                if (finalConst !== 0) {
                    if (answer && finalConst > 0) answer += '+';
                    answer += `${finalConst}`;
                }
                return { question: `${c1}${p}+${c2}${p}÷${c3}-${c4}${p}+${c5}`, answer: answer };
            },
            () => { // 4c-6d-2d x 3 + 3c
                const c = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                let d;
                do {
                    d = String.fromCharCode(97 + Math.floor(Math.random() * 26));
                } while (d === c);

                const c1 = Math.floor(Math.random() * 5) + 1;
                const c2 = Math.floor(Math.random() * 5) + 1;
                const c3 = Math.floor(Math.random() * 5) + 1;
                const c4 = Math.floor(Math.random() * 5) + 1;

                const finalCCoeff = c1 + c4;
                const finalDCoeff = -c2 - (c3 * 3);

                let answer = '';
                if (finalCCoeff !== 0) {
                    answer += `${finalCCoeff}${c}`;
                }
                if (finalDCoeff !== 0) {
                    if (answer && finalDCoeff > 0) answer += '+';
                    answer += `${finalDCoeff}${d}`;
                }
                return { question: `${c1}${c}-${c2}${d}-${c3}${d} × 3 + ${c4}${c}`, answer: answer };
            }
        ];
        return types[Math.floor(Math.random() * types.length)]();
    }

    function loadQuestion() {
        feedbackElement.textContent = '';
        feedbackElement.className = '';
        answerInput.value = '';
        if (currentLevel === 1) {
            currentQuestion = generateLevel1Question();
        } else {
            currentQuestion = generateLevel2Question();
        }
        questionElement.textContent = currentQuestion.question;
    }

    function checkAnswer() {
        const userAnswer = answerInput.value.replace(/×/g, '*').replace(/÷/g, '/').replace(/ /g, ''); // Normalize input
        const correctAnswer = currentQuestion.answer.replace(/ /g, '');

        if (userAnswer === correctAnswer) {
            feedbackElement.textContent = 'Correct! Well done.';
            feedbackElement.className = 'correct';
            score++;
            scoreElement.textContent = `Score: ${score}`;
            setTimeout(loadQuestion, 1500); // Load next question after a short delay
        } else {
            feedbackElement.textContent = `Incorrect. The correct answer is: ${currentQuestion.answer}`; // Show correct answer
            feedbackElement.className = 'incorrect';
            // Optionally, do not increment score or decrement for incorrect answers
        }
    }

    level1Btn.addEventListener('click', () => {
        currentLevel = 1;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        level1Btn.style.backgroundColor = '#0056b3';
        level2Btn.style.backgroundColor = '#007bff';
        loadQuestion();
    });

    level2Btn.addEventListener('click', () => {
        currentLevel = 2;
        score = 0;
        scoreElement.textContent = `Score: ${score}`;
        level2Btn.style.backgroundColor = '#0056b3';
        level1Btn.style.backgroundColor = '#007bff';
        loadQuestion();
    });

    submitBtn.addEventListener('click', checkAnswer);

    // Initial setup
    createKeyboard();
    loadQuestion();
    level1Btn.style.backgroundColor = '#0056b3'; // Highlight default level
});

