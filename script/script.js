// Упрощенный вид функции с валютами
// const formatCurrency = (n) => {
//     const currency = new Intl.NumberFormat('ru-RU', {
//         style: 'currency',
//         currency: 'RUB',
//         maximumFractionDigits: 2,
//     });

//     return currency.format(n);
// }

// Функция с валютами
const formatCurrency = (n) => 
    new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumFractionDigits: 2,
    }).format(n);

{
    // Навигация
    const navigationLinks = document.querySelectorAll('.navigation__link');
    const calcElems = document.querySelectorAll('.calc');

    for (let i = 0; i < navigationLinks.length; i++) {
        navigationLinks[i].addEventListener('click', (e) => {
        e.preventDefault();

            for (let j = 0; j < calcElems.length; j++) {
                if (navigationLinks[i].dataset.tax === calcElems[j].dataset.tax) {
                    calcElems[j].classList.add('calc_active');
                    navigationLinks[i].classList.add('navigation__link_active')
                } else {
                    calcElems[j].classList.remove('calc_active');
                    navigationLinks[j].classList.remove('navigation__link_active')
                }
            }
        })
    }
}

{// AUSN
    const ausn = document.querySelector('.ausn');
    const formAusn = ausn.querySelector('.calc__form');
    const resultTaxTotal = ausn.querySelector('.result__tax_total');
    const calcLabelExpenses = ausn.querySelector('.calc__label_expenses');

    calcLabelExpenses.style.display = 'none';

    formAusn.addEventListener('input', () => {
        if (formAusn.type.value === ' ') {
            calcLabelExpenses.style.display = 'none';
            resultTaxTotal.textContent = formatCurrency(formAusn.income.value * 0.08);
        }

        if (formAusn.type.value === 'expenses') {
            calcLabelExpenses.style.display = 'block';
            resultTaxTotal.textContent = formatCurrency((formAusn.income.value - formAusn.expenses.value) * 0.2);
        }
    });
}


{// Самозанятый и ИП НПД
    const selfEmployment = document.querySelector('.self-employment');
    const formSelfEmployment = selfEmployment.querySelector('.calc__form');
    const resultTaxSelfEmployment = selfEmployment.querySelector('.result__tax');
    const calcCompensation = selfEmployment.querySelector('.calc__label_compensation');
    const resultBlockCompensation = selfEmployment.querySelectorAll('.result__block_compensation');
    const resultTaxCompensation = selfEmployment.querySelector('.result__tax_compensation');
    const resultTaxRestCompensation = selfEmployment.querySelector('.result__tax_rest-compensation');
    const resultTaxResult = selfEmployment.querySelector('.result__tax_result');

    const checkCompensation = () => {
        const setDisplay = formSelfEmployment.addCompensation.checked ? 'block' : 'none';
        calcCompensation.style.display = setDisplay;

        resultBlockCompensation.forEach((elem) => {
            elem.style.display = setDisplay;
        })
    };

    checkCompensation();

    formSelfEmployment.addEventListener('input', () => {
        const resIndividual = formSelfEmployment.individual.value * 0.04;
        const resEntity = formSelfEmployment.entity.value * 0.06;

        checkCompensation();

        const tax = resIndividual + resEntity
        formSelfEmployment.compensation.value = formSelfEmployment.compensation.value > 10_000 
            ? 10_000 
            : formSelfEmployment.compensation.value;
        const benefit = formSelfEmployment.compensation.value;
        const resBenefit = formSelfEmployment.individual.value * 0.01 + 
            formSelfEmployment.entity.value * 0.02;
        const finalBenefit = benefit - resBenefit > 0 ? benefit - resBenefit : 0;
        const finalTax = tax - (benefit - finalBenefit)

        resultTaxSelfEmployment.textContent = formatCurrency(tax);
        resultTaxCompensation.textContent = formatCurrency(benefit - finalBenefit);
        resultTaxRestCompensation.textContent = formatCurrency(finalBenefit);
        resultTaxResult.textContent = formatCurrency(finalTax);
        
    });
}

{
    // ОСН / ОСНО
    const osno = document.querySelector('.osno');
    const formOsno = osno.querySelector('.calc__form');

    const ndflExpenses = osno.querySelector('.result__block_ndfl-expenses');
    const ndflIncome = osno.querySelector('.result__block_ndfl-income');
    const profit = osno.querySelector('.result__block_profit');

    const resultTaxNds = osno.querySelector ('.result__tax_nds');
    const resultTaxProperty = osno.querySelector ('.result__tax_property');
    const resultTaxNdflExpenses = osno.querySelector ('.result__tax__ndfl-expenses');
    const resultTaxNdflIncome = osno.querySelector ('.result__tax_ndfl-income');
    const resultTaxProfit = osno.querySelector ('.result__tax_profit');

    console.log(formOsno);

    const checkFormBusiness = () => {
        if (formOsno.formBusiness.value === 'ИП') {
            ndflExpenses.style.display = '';
            ndflIncome.style.display = '';
            profit.style.display = 'none';
        }

        if (formOsno.formBusiness.value === 'ООО') {
            ndflExpenses.style.display = 'none';
            ndflIncome.style.display = 'none';
            profit.style.display = '';
        }
    };

    formOsno.addEventListener('input', () => {
        checkFormBusiness();

        const income = formOsno.income.value;
        console.log('income: ', income);
        const expenses = formOsno.expenses.value;
        console.log('expenses: ', expenses);
        const property = formOsno.property.value;
        console.log('property: ', property);


        const nds = income * 0.2;
        const texProperty = property * 0.02;
        const profit = income - expenses;
        const ndflExpensesTotal = profit * 0.13;
        const ndflIncomeTotal = profit - (income - nds) * 0.13;
        const texProfit = profit * 0.2;

        resultTaxNds.textContent = nds;
        resultTaxProperty.textContent = texProperty;
        resultTaxNdflExpenses.textContent = ndflExpensesTotal;
        resultTaxNdflIncome.textContent = ndflIncomeTotal;
        resultTaxProfit.textContent = texProfit;
    });
}

{
    // УСН

    const LIMIT = 300_000;
    const usn = document.querySelector('.usn');
    const formUsn = usn.querySelector('.calc__form'); 

    const calcLabelExpenses = usn.querySelector('.calc__label_expenses')
    const calcLabelProperty = usn.querySelector('.calc__label_property')
    const resultBlockProperty = usn.querySelector('.result__block_property')

    const resultTaxTotal = usn.querySelector('.result__tax_total');
    const resultTaxProperty = usn.querySelector('.result__tax_property');

    const typeTax = {
        'income': () => {
            calcLabelExpenses.style.display = 'none';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.expenses.value = '';
            formUsn.property.value = '';
        },
        'ip-expenses': () => {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = 'none';
            resultBlockProperty.style.display = 'none';

            formUsn.property.value = '';
        },
        'ooo-expenses': () => {
            calcLabelExpenses.style.display = '';
            calcLabelProperty.style.display = '';
            resultBlockProperty.style.display = '';
        },
    }
    
    const percent = {
        'income': 0.06,
        'ip-expenses': 0.15,
        'ooo-expenses': 0.15,
    }

    typeTax[formUsn.typeTax.value]();

    formUsn.addEventListener('input', () => {
        typeTax[formUsn.typeTax.value]();

        const income = formUsn.income.value;
        const expenses = formUsn.expenses.value;
        const contibutions = formUsn.contibutions.value;
        const property = formUsn.property.value;

        let profit = income - contibutions;

        if (formUsn.typeTax.value !== 'income') {
            profit -= expenses;
        }

        const taxBigIncome = income > LIMIT ? (profit - LIMIT) * 0.01 : 0
        const summ = profit - (taxBigIncome < 0 ? 0 : taxBigIncome);
        const tax = summ * percent[formUsn.typeTax.value];
        const taxProperty = property * 0.02;

        resultTaxTotal.textContent = formatCurrency(tax);
        resultTaxProperty.textContent = formatCurrency(taxProperty);
    });
};
