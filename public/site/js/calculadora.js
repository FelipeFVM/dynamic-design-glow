// === MELHORIAS APLICADAS: Histórico de Cálculos + Animação de Resultado ===

document.addEventListener('DOMContentLoaded', () => {
    
    // Elementos do formulário
    const calculatorForm = document.getElementById('calculatorForm');
    const salarioInput = document.getElementById('salarioInput');
    const precoInput = document.getElementById('precoInput');
    const horasMensaisInput = document.getElementById('horasMensaisInput');
    const resultadoCard = document.getElementById('resultadoCard');
    const resultadoHoras = document.getElementById('resultadoHoras');
    const resultadoDias = document.getElementById('resultadoDias');
    const resultadoValorHora = document.getElementById('resultadoValorHora');
    
    // Elementos do histórico
    const historySection = document.getElementById('historySection');
    const historyList = document.getElementById('historyList');
    const clearHistoryBtn = document.getElementById('clearHistoryBtn');
    
    // Histórico de cálculos
    let calculationHistory = JSON.parse(localStorage.getItem('calculationHistory')) || [];
    
    // ===== PREENCHE PREÇO DA URL =====
    const urlParams = new URLSearchParams(window.location.search);
    const precoFromUrl = urlParams.get('preco');
    if (precoFromUrl) {
        precoInput.value = precoFromUrl;
    }
    
    // ===== FORMATAÇÃO =====
    const formatarBRL = (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL',
        }).format(valor);
    };
    
    const formatarData = (timestamp) => {
        const data = new Date(timestamp);
        return data.toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    
    // ===== VALIDAÇÃO EM TEMPO REAL =====
    const validateInput = (input) => {
        const value = parseFloat(input.value);
        const feedbackId = input.id + 'Feedback';
        let feedback = document.getElementById(feedbackId);
        
        // Cria elemento de feedback se não existir
        if (!feedback) {
            feedback = document.createElement('div');
            feedback.id = feedbackId;
            feedback.className = 'input-feedback';
            input.parentElement.appendChild(feedback);
        }
        
        if (input.value === '') {
            input.classList.remove('valid', 'invalid');
            feedback.textContent = '';
            return false;
        }
        
        if (isNaN(value) || value <= 0) {
            input.classList.remove('valid');
            input.classList.add('invalid');
            feedback.className = 'input-feedback error';
            feedback.innerHTML = '<span class="input-feedback-icon">❌</span> Valor deve ser maior que zero';
            return false;
        }
        
        input.classList.remove('invalid');
        input.classList.add('valid');
        feedback.className = 'input-feedback success';
        feedback.innerHTML = '<span class="input-feedback-icon">✅</span> Valor válido';
        return true;
    };
    
    // Adiciona validação em tempo real
    [salarioInput, precoInput, horasMensaisInput].forEach(input => {
        if (input) {
            input.addEventListener('input', () => validateInput(input));
            input.addEventListener('blur', () => validateInput(input));
        }
    });
    
    // ===== HISTÓRICO =====
    const renderHistory = () => {
        if (!historyList || calculationHistory.length === 0) {
            if (historySection) historySection.style.display = 'none';
            return;
        }
        
        if (historySection) historySection.style.display = 'block';
        historyList.innerHTML = '';
        
        // Mostra os últimos 5 cálculos (mais recentes primeiro)
        const recentHistory = calculationHistory.slice(-5).reverse();
        
        recentHistory.forEach(calc => {
            const li = document.createElement('li');
            li.className = 'history-item';
            li.innerHTML = `
                <div class="history-item-details">
                    <strong>${formatarBRL(calc.preco)}</strong> com salário de ${formatarBRL(calc.salario)}
                    <div class="history-item-time">${formatarData(calc.timestamp)}</div>
                </div>
                <div style="font-size: 0.9rem; font-weight: 700; color: var(--primary);">
                    ${calc.horas} horas
                </div>
            `;
            
            // Clique para recarregar cálculo
            li.style.cursor = 'pointer';
            li.addEventListener('click', () => {
                salarioInput.value = calc.salario;
                precoInput.value = calc.preco;
                horasMensaisInput.value = calc.horasMensais;
                calculatorForm.dispatchEvent(new Event('submit'));
            });
            
            historyList.appendChild(li);
        });
    };
    
    const addToHistory = (calculation) => {
        calculationHistory.push(calculation);
        
        // Mantém apenas os últimos 10 no localStorage
        if (calculationHistory.length > 10) {
            calculationHistory.shift();
        }
        
        localStorage.setItem('calculationHistory', JSON.stringify(calculationHistory));
        renderHistory();
    };
    
    const clearHistory = () => {
        if (confirm('Tem certeza que deseja limpar todo o histórico?')) {
            calculationHistory = [];
            localStorage.removeItem('calculationHistory');
            renderHistory();
        }
    };
    
    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener('click', clearHistory);
    }
    
    // ===== CÁLCULO =====
    if (calculatorForm) {
        calculatorForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            // Valida todos os campos
            const isValid = [salarioInput, precoInput, horasMensaisInput]
                .every(input => validateInput(input));
            
            if (!isValid) {
                alert('Por favor, preencha todos os campos com valores válidos.');
                return;
            }
            
            // Pega valores
            const salario = parseFloat(salarioInput.value);
            const preco = parseFloat(precoInput.value);
            const horasMensais = parseFloat(horasMensaisInput.value);
            
            // Realiza cálculos
            const valorHora = salario / horasMensais;
            const horasNecessarias = preco / valorHora;
            const diasNecessarios = horasNecessarias / 8;
            
            // Atualiza resultado
            if (resultadoValorHora) resultadoValorHora.textContent = formatarBRL(valorHora);
            if (resultadoHoras) resultadoHoras.textContent = `${horasNecessarias.toFixed(2)} horas`;
            if (resultadoDias) resultadoDias.textContent = `${diasNecessarios.toFixed(2)} dias`;
            
            // Mostra card de resultado com animação
            if (resultadoCard) {
                resultadoCard.style.display = 'block';
                
                // Remove e readiciona animação
                resultadoCard.style.animation = 'none';
                setTimeout(() => {
                    resultadoCard.style.animation = 'resultAppear 0.5s ease forwards';
                }, 10);
                
                // Scroll suave para o resultado
                setTimeout(() => {
                    resultadoCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
            
            // Adiciona ao histórico
            addToHistory({
                salario,
                preco,
                horasMensais,
                horas: horasNecessarias.toFixed(2),
                dias: diasNecessarios.toFixed(2),
                valorHora: valorHora.toFixed(2),
                timestamp: Date.now()
            });
        });
    }
    
    // Renderiza histórico inicial
    renderHistory();
    
    // ===== ATALHOS DE TECLADO =====
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + Enter para submeter
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            if (calculatorForm) {
                calculatorForm.dispatchEvent(new Event('submit'));
            }
        }
        
        // Ctrl/Cmd + K para focar no primeiro input
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            if (salarioInput) salarioInput.focus();
        }
    });
    
    // ===== TOOLTIP DE AJUDA =====
    const addHelpTooltip = () => {
        const inputs = [salarioInput, precoInput, horasMensaisInput];
        const tooltips = [
            'Digite seu salário mensal em reais (ex: 1412)',
            'Digite o preço do produto que deseja comprar',
            'Digite quantas horas você trabalha por mês (padrão: 176h)'
        ];
        
        inputs.forEach((input, index) => {
            if (input) {
                input.setAttribute('title', tooltips[index]);
                input.setAttribute('placeholder', tooltips[index]);
            }
        });
    };
    
    addHelpTooltip();
});
