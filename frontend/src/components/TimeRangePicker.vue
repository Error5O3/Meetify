<template>
  <div class="time-range-picker">
    <h3 :class="['time-header', {'errorMsg':startTime >= endTime}]">Meeting Time Range</h3>
    <p class="errorMsg" v-if="startTime >= endTime">Start time cannot be later than end time.</p>
    
    <div class="time-inputs">
      <input 
        type="time" 
        :value="startTime"
        @input="$emit('update:startTime', $event.target.value)"
        :class="['time-input', {'errorMsg':startTime >= endTime}]"
      />
      
      <span class="separator">to</span>
      
      <input 
        type="time"
        :value="endTime"
        @input="$emit('update:endTime', $event.target.value)"
        :class="['time-input', {'errorMsg':startTime >= endTime}]"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeRangePicker',
  props: {
    startTime: {
      type: String,
      default: '09:00'
    },
    endTime: {
      type: String,
      default: '17:00'
    }
  }
}
</script>

<style scoped>
.time-range-picker {
  display: flex;
  flex-direction: column;
  width: fit-content;
  align-items: center;
}

.time-header {
  font-size: var(--heading);
  color: var(--text);
  text-align: center;
  width: fit-content;
}

.time-inputs {
  display: flex;
  align-items: center;
  gap: 12px;
  background-color: transparent;
  border-radius: 0;
  padding: 8px;
  border-radius: 8px;
  background: var(--primary);
  margin-top: 15px;
}

.time-input {
  flex: 1;
  width: fit-content;
  min-width: 164px;
  padding: 8px 12px;
  font-size: var(--sub_h2);
  font-family: 'Jura', sans-serif;
  font-weight: 700;
  border: 1px solid var(--light);
  background-color: white;
  border-radius: 6px;
  outline: none;
  cursor: pointer;
  transition: border-color 0.2s;
}

.time-input:focus {
  background-color: var(--light_primary);
}

.time-input:hover{
  background-color: var(--light_primary);
}

.separator {
  font-size: var(--sub_h2);
  color: var(--text);
  font-weight: 700;
}

.errorMsg {
  text-align: center;
  color: red;
}

@media (max-width: 1330px) {
  .time-input {
    font-size:var(--details);
    min-width: 140px;
  }
}

@media (max-width: 1070px){
  .time-range-picker {
    width: 512px;
  }
}

@media (max-width: 768px) {
  .time-input {
    padding: 4px 8px;
    font-size:var(--sub_h2);
    min-width: 164px;
  }

  .time-inputs {
    gap: 8px;
  }

  .time-range-picker {
    width: 100%;
    min-width: fit-content;
    max-width: 512px;
  }
}

@media (max-width:464px) {
  .time-input {
    font-size:var(--details);
    min-width: 140px;
  }

  .time-header {
    font-size: var(--sub_h1);
  }
}
</style>