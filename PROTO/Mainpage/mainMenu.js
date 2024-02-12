    const monthYearElement = document.getElementById('monthYear');
    const datesElement = document.getElementById('dates');
    const previous = document.getElementById('previous');
    const next = document.getElementById('next');

     currentDate = new Date();  // Set the current date

    function updateCalendar() {
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();

        const firstDay = new Date(currentYear, currentMonth, 0);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const totalDays = lastDay.getDate();
        const firstDayIndex = firstDay.getDay() + 1;
        const lastDayIndex = lastDay.getDay() + 1;

        const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
        monthYearElement.textContent = monthYearString;

        let datesHTML = '';

        /**
         * This for loop appends all dates of the previous month.
         * 
         * firstDayIndex- What day of the week (0-Sunday, 6-Saturday)
         * prevDate - From Sunday of the last month to this month's first day of the week.
         */

        for (let i = firstDayIndex; i > 0; i --){
            const prevDate = new Date(currentYear,currentMonth,-i+1);
            datesHTML += `<div class="date inactive">${''} </div>`;
        }
        /**
         * This for loop appends all dates of this month.
         * 
         * totalDays- Total days of this month
         * activeClass - 'active' if it's today's date, '' otherwise.
         */
        for (let i = 1; i <= totalDays; i++) {
            const date = new Date(currentYear, currentMonth, i);
            const activeClass = date.toDateString() === new Date().toDateString() ? 'active' : 'unclicked';
            datesHTML += `<div class="date ${activeClass}"> ${i} </div>`;
        }
        /**
         * This for loop appends the remaining dates in the calendar unfilled by the current month.
         * 
         * nextDate = The first date of next month.
         * 
         */

        for (let i = 1; i <= 7 - lastDayIndex; i++) {
            const nextDate = new Date(currentYear, currentMonth + 1, i);
            datesHTML += `<div class="date inactive">${''}</div>`;
        }

        datesElement.innerHTML = datesHTML;

        const unclickedElements = document.querySelectorAll('.date.unclicked');
        unclickedElements.forEach((element) => {
            element.addEventListener('click', handleActiveDivClick);
        });

    }

updateCalendar();

function handleActiveDivClick(){
    const clickedElement = event.currentTarget;

    const currentActive = document.querySelectorAll('.date.active');

    if (!clickedElement.classList.contains('active')) {
        document.querySelectorAll('.date.active').forEach((element) => {
            element.classList.remove('active');
        });

        clickedElement.classList.remove('unclicked');
        clickedElement.classList.add('active');

        const selectedDate = new Date(currentDate.getFullYear(),currentDate.getMonth(),clickedElement.textContent);
        alert(selectedDate)
    }


}





previousMonth.addEventListener('click',() =>{
    currentDate.setMonth(currentDate.getMonth() - 1);
    updateCalendar();
});

nextMonth.addEventListener('click',() =>{
    currentDate.setMonth(currentDate.getMonth() + 1);
    updateCalendar();
});





