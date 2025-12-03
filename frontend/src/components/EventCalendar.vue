<template>
  <div class="calendar-container">
    <slot/>
    
    <div class="calendar">
      <div class="calendar-nav">
        <button @click="prevMonth" :class="['nav-button', {'past':isPastMonth()}]">‹</button>
        <div class="month-year">{{ monthYear }}</div>
        <button @click="nextMonth" class="nav-button">›</button>
      </div>
      
      <div class="weekdays">
        <div v-for="day in weekdays" :key="day" class="weekday">{{ day }}</div>
      </div>
      
      <div class="days">
        <div 
          v-for="day in calendarDays" 
          :key="day.key"
          :class="getDayClass(day)"
          @click="selectDay(day)"
        >
          <span v-if="day.date">{{ day.date }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EventCalendar',
  props: {
    selectedDates: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      weekdays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
      today: new Date()
    }
  },
  computed: {
    monthYear() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June',
                     'July', 'August', 'September', 'October', 'November', 'December']
      return `${months[this.currentMonth]} ${this.currentYear}`
    },
    calendarDays() {
      const days = []
      const firstDay = new Date(this.currentYear, this.currentMonth, 1)
      const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0)
      const startPadding = firstDay.getDay()
      
      for (let i = 0; i < startPadding; i++) {
        days.push({ key: `empty-${i}`, date: null })
      }
      
      for (let i = 1; i <= lastDay.getDate(); i++) {
        days.push({ 
          key: `day-${i}`,
          date: i,
          fullDate: new Date(this.currentYear, this.currentMonth, i)
        })
      }
      
      return days
    }
  },
  methods: {
    prevMonth() {
      const today = new Date()
      if(today.getMonth() !== this.currentMonth || today.getFullYear() !== this.currentYear) {
        if (this.currentMonth === 0) {
        this.currentMonth = 11
        this.currentYear--
        } else {
          this.currentMonth--
        }
      }
    },
    isPastMonth(){
      const today = new Date()
      return today.getMonth() === this.currentMonth && today.getFullYear() === this.currentYear
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0
        this.currentYear++
      } else {
        this.currentMonth++
      }
    },
    isPastDate(day) {
      if (!day.fullDate) return false
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return day.fullDate < today
    },
    isSelected(day) {
      if (!day.fullDate) return false
      return this.selectedDates.some(d => 
        d.getTime() === day.fullDate.getTime()
      )
    },
    getDayClass(day) {
      return {
        'day': true,
        'empty': !day.date,
        'past': this.isPastDate(day),
        'selected': this.isSelected(day),
      }
    },
    selectDay(day) {
      if (!day.date || this.isPastDate(day)) return
      
      const dates = [...this.selectedDates]
      const index = dates.findIndex(d => d.getTime() === day.fullDate.getTime())
      
      if (index > -1) {
        dates.splice(index, 1)
      } else {
        dates.push(day.fullDate)
      }
      
      this.$emit('update:selectedDates', dates.sort((a, b) => a - b))
    }
  }
}
</script>

<style scoped>

.calendar-container {
  flex: 1;
  min-width: 350px;
}

.calendar {
  margin-top: 15px;
  background-color: transparent;
  border-radius: 0;
  padding: 0;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background-color: var(--primary);
  border-radius: 8px;
}

.nav-button {
  background: none;
  border: none;
  font-size: var(--heading);
  cursor: pointer;
  color: var(--text);
  padding: 5px 10px 10px;
  transition: color 0.2s;
}

.nav-button:hover:not(.past) {
  color: var(--dark_primary);
}

.month-year {
  font-size: var(--sub_h1);
  font-weight: 700;
  color: var(--text);
}

.weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
  margin-bottom: 8px;
  background-color: var(--light_primary);
  border-radius: 8px;
}

.weekday {
  text-align: center;
  font-size: var(--sub_h2);
  font-weight: 700;
  color: var(--text);
  padding: 5px 0;
}

.days {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 5px;
}

.day {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0;
  cursor: pointer;
  font-size: var(--sub_h2);
  transition: all 0.2s;
  position: relative;
  color: var(--text);
  border-radius: 50%;
}

.day:not(.empty):not(.past):not(.day.selected):hover {
  background-color: var(--light_primary);
}

.day.empty {
  cursor: default;
}

.nav-button.past {
  color: transparent;
  cursor: default;
}

.past {
  color: var(--light);
  cursor: not-allowed;
}

.day.selected {
  background-color: var(--primary);
  color: var(--text);
}
@media (max-width: 1330px) {
  .day {
    font-size:var(--details);
  }
}

@media (max-width: 768px) {
  .calendar-container {
    min-width: 333px;
  }

  .day {
    font-size:var(--sub_h2);
  }
}

@media (max-width:464px) {
  .day {
    font-size:var(--details);
  }
}
</style>