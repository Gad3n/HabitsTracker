async function loadHabits() {
    const response = await fetch('/habits');
    const habits = await response.json();
    const container = document.getElementById('habits_list');
    container.innerHTML = '';

    habits.forEach(habit => {
        const block = document.createElement('div');
        block.dataset.id = habit.id;
        const nameSpan = document.createElement('span');
        nameSpan.textContent = habit.name;

        const completeBtn = document.createElement('button');
        const deleteBtn = document.createElement('button');
        completeBtn.dataset.id = habit.id;
        deleteBtn.dataset.id = habit.id;
        completeBtn.className = 'complete_button';
        deleteBtn.className = 'delete_button';

        completeBtn.addEventListener('click', async (e) => {
            e.stopPropagation();
            const id = e.target.dataset.id;
            try {
                const res = await fetch(`/habits/${id}/complete`, { method: 'POST' });
                if (!res.ok) throw new Error('Error Complete Button');
                const updatedHabits = await res.json();
                completeBtn.classList.toggle('completed');
                console.log('Updated habits:', updatedHabits);
            } catch (err) {
                console.error(err);
            }


        });

        deleteBtn.addEventListener('click', async (e) => {
            e.stopImmediatePropagation();
            const id = e.target.dataset.id;
            if (confirm('Delete habit?')) {
                try {
                    const res = await fetch(`/habits/${id}/delete`, { method: 'POST' });
                    if (!res.ok) throw new Error('Error Delete Button');
                    block.remove();
                    console.log('Habit delete');
                } catch (err) {
                    console.error(err);
                }
            }
        });

        block.appendChild(nameSpan);
        block.appendChild(completeBtn);
        block.appendChild(deleteBtn);
        container.appendChild(block);
    })
}

document.getElementById('habit_create').addEventListener('submit', async function (e) {
    e.preventDefault();
    const habit_name = document.getElementById('form_habit_name').value;
    const habit_color = document.getElementById('form_habit_color').value;
    console.log('Data send:', { habit_name, habit_color });
    try {
        const response = await fetch('/habits', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ habit_name, habit_color })
        });
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Status error:', response.status);
            console.error('Answer body:', errorText);
            throw new Error(`HTTP ${response.status}: ${errorText}`)
        }
        const result = await response.json();
        console.log('Habit add');
        closeForm();
        document.getElementById('form_habit_name').value = '';
        document.getElementById('form_habit_color').value = '#ff9800';
        loadHabits();
    } catch (err) {
        console.error(err);
        alert('Habit dont add');
    }
})

const form = document.getElementById('form_window')
const openBtn = document.getElementById('form_opener')
const closeBtn = document.getElementById('close_button')

function openForm() {
    form.classList.remove('hidden')
}

function closeForm() {
    form.classList.add('hidden')
}

openBtn.addEventListener('click', openForm)
closeBtn.addEventListener('click', closeForm)

loadHabits()