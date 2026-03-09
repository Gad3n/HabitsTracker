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

loadHabits()