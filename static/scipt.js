async function loadHabits() {
    const response = await fetch('/habits');
    const habits = await response.json();
    const container = document.getElementById('habits_list');

    habits.forEach(habit => {
        const block = document.createElement('div');

        block.textContent = habit.name

        container.appendChild(block);
    });
}
document.getElementById('habit_create').addEventListener('submit', function (e) {
    e.preventDefault();
    const formData = new FormData(this)
    const data = Object.fromEntries(formData.entries());

    fetch('/habits', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => response.json())
        .then(result => console.log(result))
})
document.getElementById('complete_check').addEventListener('click', async function (e) {
    const habit_id = this.getAttribute('id');
    fetch('/habits/1/complete', {
        method: 'POST'
    })
        .then(response => response.json())
        .then(result => console.log(result))
})
loadHabits()