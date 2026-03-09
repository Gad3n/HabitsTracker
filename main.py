from dataclasses import dataclass
from datetime import date
from typing import List
import json

file = 'habits.json'


@dataclass
class Habit:
    name: str
    id: int
    color: str = ''

    complete_dates: List[date] = None

    def __post_init__(self):
        if self.complete_dates is None:
            self.complete_dates = []

    def to_dict(self):
        return {'name': self.name,
                'id': self.id,
                'color': self.color,
                'complete_dates': [d.isoformat() for d in self.complete_dates], }


class Tracker():
    def __init__(self):
        self.habits = {}
        self.new_id = 0

    def add_habit(self, name: str, color: str):
        self.new_id += 1
        new_habit = Habit(name, self.new_id, color)

        self.habits[self.new_id] = new_habit
        return self.new_id

    def delete_habit(self, habit_id: int):
        if habit_id in self.habits:
            del self.habits[habit_id]
            self.save()
            return True
        else:
            return False

    def get_habit(self, habit_id: int):
        habit = self.habits[habit_id]
        return habit

    def date_complete(self, habit_id: int, complete_dates: date = date.today()):
        habit = self.get_habit(habit_id)
        if complete_dates not in habit.complete_dates:
            habit.complete_dates.append(complete_dates)
        else:
            habit.complete_dates.remove(complete_dates)

    def save(self):
        full_dict = []
        for k in self.habits:
            habit = self.get_habit(k)
            full_dict.append(habit.to_dict())
        with open(file, 'w', encoding='utf-8') as f:
            json.dump(full_dict, f, ensure_ascii=False, indent=4)

    def load(self):
        try:
            with open(file, 'r', encoding='utf-8') as f:
                load_data = json.load(f)
        except FileNotFoundError:
            load_data = []
        except json.JSONDecodeError:
            load_data = []

        for i in load_data:
            dates = [date.fromisoformat(d_str)
                     for d_str in i['complete_dates']]
            load_habit = Habit(i['name'], i['id'],
                               i['color'], dates)
            self.habits[i['id']] = load_habit
        if self.habits:
            self.new_id = max(self.habits.keys())
