<template>
  <div class="event-form">
    <div class="event-details">
      <input 
        type="text" 
        v-model="eventName"
        placeholder="Event Name*"
        :class="['input-field', 'event-name', {'error-field': !isInitialName && !eventName}]"
      />
      <p class="errorMsg" v-if="!isInitialName && !eventName">*Please enter an event name.</p>
      
      <!-- <input 
        type="text"
        v-model="eventDescription"
        placeholder="Event Description (Optional)"
        :class="['input-field', 'event-description', {'not-empty':eventDescription}]"
      /> -->
    </div>
    <div class="calendar-time-section">
      <Calendar 
        :selectedDates="selectedDates"
        @update:selectedDates="selectedDates = $event"
      >
      <h3 :class="['calendar-header', {'error-field': !isInitialDate && selectedDates.length === 0}]">Select Potential Meeting Days*</h3>
      <p class="errorMsg" v-if="!isInitialDate && selectedDates.length === 0" style="justify-self: center;">*Please select at least one date.</p>
      </Calendar>
      
      <div class="time-picker-column">
        <TimeRangePicker 
          :startTime="startTime"
          :endTime="endTime"
          @update:startTime="startTime = $event"
          @update:endTime="endTime = $event"
        />
        
        <div class="timezone-info">
          Shown in local time ({{ timezone }})
        </div>

        <button class="create-button" @click="createEvent">
          Create →
        </button>
      </div>
    </div>

  </div>
</template>

<script>
import Calendar from './EventCalendar.vue'
import TimeRangePicker from './TimeRangePicker.vue'

export default {
  name: 'EventForm',
  components: {
    Calendar,
    TimeRangePicker
  },
  data() {
    return {
      eventName: '',
      eventDescription: '',
      selectedDates: [],
      formatedDates: [], 
      startTime: '09:00',
      endTime: '17:00',
      timezone: this.getTimezone(),
      isInitialName: true,
      isInitialDate: true,
      api: 'http://localhost:8081'
    }
  },
  methods: {
    getTimezone() {
      const offset = -new Date().getTimezoneOffset() / 60
      const zones = {
        '-8': 'PST',
        '-7': 'PDT',
        '-6': 'CST',
        '-5': 'EST',
        '-4': 'EDT'
      }
      return zones[offset] || `UTC${offset >= 0 ? '+' : ''}${offset}`
    },
    async createEvent() {
      if ((!this.eventName || this.selectedDates.length === 0) || this.startTime >= this.endTime) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        if (!this.eventName) {
          this.isInitialName = false;
        }
        if (this.selectedDates.length === 0) {
          this.isInitialDate = false;
        }
        return;
      }
      // this will format the dates into YYYY-MM-DD uts for the api request
      for(let i = 0 ; i < this.selectedDates.length; i++){
        const currendate = this.selectedDates[i];
        const yyyyMMdd = currendate.toISOString().slice(0,10);
        this.formatedDates.push(yyyyMMdd);
      }
      // this will sereve as a request for the endpoint to fetch
      const eventData = {
        name: this.eventName,
        // description: this.eventDescription,
        dates: this.formatedDates,
        // timeRange: {
        //   start: this.startTime,
        //   end: this.endTime
        // }
        start_time: this.startTime,
        end_time: this.endTime,
      }
      
      console.log('Event created:', eventData)
      await this.postEvent(eventData);
    },
      // this is to send to the Go backend later so just ignore for now
      async postEvent(eventData){
        //placeholder user_id, coul be removed
        
        const url = `${this.api}/event`;
        const response = await fetch(url , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // we convert into a JSON string to sent to the backend
          body: JSON.stringify(eventData)
        })
        const result = await response.json();
        console.log(result);

        // backend will returns an event ID (this is just a placeholder for now)
        const newEventId = result.event_id; 

        window.scrollTo({ top: 0});
        this.$router.push({   
          name: 'EventDetails', 
          params: { id: newEventId } 
      });
    }
  }
  }
</script>

<style scoped>
.event-form {
  width: 70%;
  min-width: 333px;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 40px;
}

.time-picker-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.event-details {
  padding-bottom: 25px;
}

.input-field {
  width: 100%;
  padding-bottom: 8px;
  font-size: var(--sub_h2);
  border: none;
  background-color: transparent;
  outline: none;
  border-bottom: 1px solid;
}

.input-field:focus {
  border-bottom-color: var(--primary);
}

.input-field::placeholder {
  font-family: 'Jura', sans-serif; 
  font-weight: 700;
}

.event-name, .event-name::placeholder {
  font-size: var(--heading);
  color: black;
  font-family: 'Jura', sans-serif; 
  font-weight: 700;
}

.event-description, .event-description::placeholder {
  margin-top: 25px;
  font-size: var(--detail);
  color: var(--mid);
  font-family: 'Jura', sans-serif; 
  font-weight: 700;
}

.calendar-time-section {
  display: flex;
  gap: 60px;
  margin-top: 10px;
  align-items: stretch;
}

.calendar-header {
  font-size: var(--heading);
  font-weight: 700;
  color: var(--text);
  text-align: center;
}

.time-picker-column {
    display: flex;
    flex-direction: column; 
}

.timezone-info {
  margin-top: 15px; 
  font-size: var(--detail);
  color: var(--dark);
  text-align: left; 
  width: 100%;
}

.create-button {
  margin-top: 333px; 
  margin-left: auto;
  padding: 14px;
  width:100%; 
  font-size: var(--heading); 
  font-family: 'Jura', sans-serif;
  display: block;
  font-weight: 700;
  background-color: var(--primary);
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.create-button:hover {
  background-color: var(--hover_dark);
}

.errorMsg {
  text-align: left;
  color: red;
}

.error-field {
  border-bottom-color: red;
  color: red;
}

.error-field::placeholder {
  color: red;
}

.not-empty {
  color: black;
}

@media (max-width: 1330px) {
  .event-form {
    width: 75%;
  }
}

@media (max-width: 1070px){
  .calendar-time-section {
    flex-direction: column;
    align-items: center;
    gap:25px;
  }

  .create-button {
    margin-top: 25px; 
    margin-bottom: 40px;
    width: 100%;
  }

  .event-form {
    width: 80%;
    min-width: 333px;
  }

  .time-picker-column {
    width: 100%;
  }

  .timezone-info {
    width: 512px;
  }
}

@media (max-width: 768px) {
  .timezone-info {
    width: 100%;
    max-width: 512px;
  }
}

@media (max-width:464px) {
  .calendar-header {
    font-size: var(--sub_h1);
    width: 200px;
    justify-self: center;
  }
}
</style>