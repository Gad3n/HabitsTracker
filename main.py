from dataclasses import dataclass
from datetime import date
from typing import List


@dataclass
class Habit:
    name: str
    id: int
    color: str = ''
    streak: int = 0
    period_to_do: int = 1
    period_in_day_to_do: int = 30

    complete_day: List[date] = None

    def __post_init__(self):
        if self.complete_day is None:
            self.complete_day = []


asd = Habit('TeethBrush', 1)

asd.color = '#f85f13'
