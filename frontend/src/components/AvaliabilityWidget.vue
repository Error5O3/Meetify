<template>
    <div class="availabilities-container">
        <slot/>
        <div class="availabilities-nav">
            <button @click="prevPage" :class="['nav-button', {'disabled':page == 1}]">‹</button>
            <div class="month-header">
                <span>{{monthHeader}}</span>
                <span>{{ page }}/{{ numPages }}</span>
            </div>
            <button @click="nextPage" :class="['nav-button', {'disabled':page == numPages}]">›</button>                
        </div>

        <div class="days-grid">
            <div class="time-col">
                <div v-for="time in timeHeaders" :key="time" class="time-header">
                    {{time}}
                </div>
            </div>

            <div class="days">
                <div class="day-headers">
                    <div v-for="(day, index) in dayHeaders.slice(from, to)" :key="day" class="day-header">
                        <p>{{ day }}</p>
                        <p>{{ dayHeaderDates[index+from]}}</p>
                    </div>
                </div>
                <div class="day-slots">
                    <div v-for="(day) in time_slots.slice(from, to)" :key="day" class="day-col">
                        <div v-for="slot in day" :key="slot.id" 
                            @click="toggleAvail(slot.id)" 
                            @mouseover="num = !editing? slot.num_available : -1" 
                            @mouseleave="num = -1"  
                            :class="['day-slot', {'editing' :editing}]" 
                            :style="editing ? 
                                [{'cursor':'pointer'}, {'background-color': availability.has(slot.id) ? 'var(--primary)' : 'white'}, 
                                {'border-color': availability.has(slot.id) ? 'var(--hover_dark)' : 'var(--mid)'}]: 
                                [{'background-color': heatMap(slot.num_available)}, 
                                {'border-color': slot.num_available > 0 ? heatMap(slot.num_available) : 'var(--mid)'}]">
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="responders-header">
            Responders (<span :style="[{'display': num > -1 ? 'inline': 'none'}]">{{ num}}/</span>{{ numUsers }})
        </div>

        <div class="responders">
            <!-- Add greying out of unavailiable people -->
            <div v-for="user in users" :key="user" class="responder">
                {{ user }}
            </div>
        </div>

        <button v-show="!editing" @click="enterEdit" class="add-availiability-button">
            Add Availability
        </button>

        <button v-show="editing" @click="updateAvail" class="add-availiability-button">
            Confirm
        </button>
        <button v-show="editing" @click="cancelAvail" class="cancel-availiability-button">
            Cancel
        </button>
    </div>
</template>

<script>
export default {
    name: "AvaliabilityWidget",
    props: {
        editing: {
            type: Boolean,
            default: false
        },
        eventName: {
            type: String,
            default: ''
        },
        userID: {
            type: [Number, null],
            default: null
        },
    },
    data() {
        return {
            width: window.innerWidth,
            api: 'http://18.222.30.255:8081',
            eventID: '',
            eventData: {},
            availability: new Set(),
            dates:[],
            time_slots:[],
            users:[],
            numUsers: 0,
            num: -1,
            page: 1,
            numPages:1,
            from:1,
            to:1,
            timeHeaders: [],
            dayHeaders: [],
            dayHeaderDates: [],
            monthHeader: '',
            weekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
            months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June',
                     'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        };
    },
    async mounted() {
        this.eventID = this.$route.params.id
        await this.fetchEventData();
        this.unwrapData();
        this.tableHeaders();
        window.addEventListener('resize', this.paginate);
        this.paginate();
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.paginate);
    },
    methods: {
        async fetchEventData() {
            let url = `${this.api}/events/${this.eventID}`
            try {
                const response = await fetch(url);

                if (!response.ok) {
                throw new Error(`${response.status}`);
                }

                this.eventData = await response.json();
                console.log('Event data retrieved successfully:', this.eventData);

                this.$emit('update:eventName', this.eventData.name)

            } catch (error) {
                console.error('Error retrieving event data:', error);
            }
        },
        async fetchUserData() {
        //fetch availiability 
        if(this.userID != null) {
            try {
            let url = `${this.api}/availability/${this.userID}`
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`${response.status}`);
            }

            let userAvail = await response.json();
            console.log('User availability data retrieved successfully:', userAvail);

            this.availability = new Set(userAvail.avail)

            } catch (error) {
            console.error('Error retrieving user availability data:', error);
            }
        }
        },
        unwrapData() {
            this.dates = this.eventData.dates;
            this.time_slots = this.eventData.time_slots;
            this.users = this.eventData.users;
            this.numUsers = this.eventData.numUsers;
            // this.user_id = 3;
            // this.availability = new Set([1, 5, 8])
        },
        tableHeaders() { //the entire avaliability table
            // this.days = [];
            this.dayHeaders = [];
            this.dayHeaderDates = [];
            this.timeHeaders = [this.getTimezone()];

            for (let i = 0; i<this.dates.length; i++) {
                // this.days.push([]);
                for(let j = 0; j < this.time_slots[i].length; j++) {
                    if (j ==0) { //day header
                        let day = new Date(this.dates[i]);
                        //the date is correct in database but for some reason it is a day behind
                        day.setDate(day.getDate() + 1); 
                        this.dayHeaders.push(this.weekdays[day.getDay()]);
                        this.dayHeaderDates.push(day.getDate());
                    }
                    // let id = this.time_slots[i][j].id;
                    // let numAvail = this.time_slots[i][j].numAvail

                    // this.days[i].push({id, 'avail':numAvail}) 
                }
            }

            for(let j = 0; j < this.time_slots[0].length; j++) {
                let time = this.time_slots[0][j].start_time.split(":");
                let date = new Date();
                date.setHours(time[0]);

                this.timeHeaders.push(date.toLocaleTimeString("en-US", {
                    hour: 'numeric',
                }))
            }
        },
        paginate() {
            this.width = window.innerWidth;

            let numPerPage; 

            //diff number per page depending on device size
            if (this.width < 768) {
                numPerPage = 3;
            } else if (this.width < 1070){
                numPerPage = 7; 
            } else {
                numPerPage = 5
            }
            this.numPages = Math.ceil(this.dates.length/numPerPage);

            //range
            this.from = (this.page * numPerPage) - numPerPage;
            this.to = (this.page * numPerPage) < this.dates.length ? (this.page * numPerPage) : this.dates.length;

            //month header
            let startDate = new Date(this.dates[this.from]);
            let endDate = new Date(this.dates[this.to-1]);

            if(startDate.getMonth()==endDate.getMonth() && startDate.getFullYear()==endDate.getFullYear()) {
                this.monthHeader = `${this.months[startDate.getMonth()]} ${startDate.getFullYear()}`;
            } else {
                this.monthHeader = `${this.months[startDate.getMonth()]} ${startDate.getFullYear()} - ${this.months[endDate.getMonth()]} ${endDate.getFullYear()}`;
            }
        },
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

        nextPage() {
            if(this.page < this.numPages) {
                this.page++;
                this.paginate();
            }
        },

        prevPage() {
            if(this.page > 1) {
                this.page--;
                this.paginate();
            }
        },
        // toDate(date) {
        //     let dateArr = date.split("-")
        //     return new Date(dateArr[0], dateArr[1]-1, dateArr[2])
        // },
        heatMap(num) {
            return `rgba(0, 190, 113, ${num/this.numUsers})`
        },
        async updateAvail() {
            //send update to database here
            if(this.userID == null) {
                return;
            }

            for (let i = 0; i < this.time_slots.length; i++) {
                for (let j = 0; j < this.time_slots[i].length; j++) {
                    let id = this.time_slots[i][j].id;
                    const data = {
                        time_slot_id: id
                    }

                    console.log();

                    let url = `${this.api}/availability?user_id=${this.userID}`
                    //mark all time slot ids in availability to be availabile
                    if (this.availability.has(id)) {
                        try {
                            const response = await fetch(url , {
                                method: 'POST',
                                headers: {
                                'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })

                            if(!response.ok) { 
                                throw new Error(`${response.status}`);
                            }
                            console.log('User post availability successful:');
                        } catch (error) {
                            console.error('Error posting user availability:', error);
                        }
                    } else { //else mark the slots unavailabile
                        let url = `${this.api}/availability?user_id=${this.userID}`

                        try {
                            const response = await fetch(url , {
                                method: 'DELETE',
                                headers: {
                                'Content-Type': 'application/json'
                                },
                                body: JSON.stringify(data)
                            })

                            if(!response.ok) { 
                                continue;
                            }
                            console.log('User delete availability successful:');
                        } catch (error) {
                            console.error('Error deleting user availability:', error);
                        }
                    }
                }
            }
            await this.fetchEventData()
            this.unwrapData();
            this.$emit('update:editing', false)
        },
        cancelAvail() {
            this.$emit('updateData')
            this.$emit('update:editing', false)
        },
        toggleAvail(id) {
            if (this.availability.has(id)) {
                this.availability.delete(id)
            } else {
                this.availability.add(id)
            }
            
        },
        async enterEdit() {
            await this.fetchUserData()
            this.$emit('update:editing', true)
        }
    },
}
</script>

<style>

.availabilities-container {
    min-width: 333px;
    width: 100%;
}

.days {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.day-slot {
    height: 40px;
    border: 0.5px solid var(--mid);
    display: flex;
    justify-content: center;
    align-items: center;
}

.days-grid, .day-headers, .day-slots {
    display: flex;
    flex-direction: row;
}

.days-grid {
    gap: 8px;
    font-size: var(--detail);
}

.day-header, .day-col {
    width: 100%;
    text-align: center;
}

.day-headers {
    margin-bottom:8px;
}

.day-slots {
    border: 1px solid var(--mid);
}

.time-header {
    display: flex;
    flex-direction: column;
    align-items: end;
    height: 40px;
}

.time-col {
    margin-top:8px;
    min-width: 55px;
}

.availabilities-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  background-color: var(--primary);
  border-radius: 8px;
}

.month-header {
  font-size: var(--sub_h1);
  font-weight: 700;
  color: var(--text);
  flex:1;
  display: flex;
  justify-content: space-between;
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

.nav-button.disabled {
  color: transparent;
  cursor: default;
}

.add-availiability-button {
  margin-top: 15px; 
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

.cancel-availiability-button {
  margin-top: 15px; 
  margin-left: auto;
  padding: 14px;
  width:100%; 
  font-size: var(--heading); 
  font-family: 'Jura', sans-serif;
  display: block;
  font-weight: 700;
  background-color: var(--light);
  color: black;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.cancel-availiability-button:hover {
  background: var(--mid);
}

.add-availiability-button:hover {
  background-color: var(--hover_dark);
}

.responders-header {
    font-size: var(--sub_h1);
    margin: 12px;
}

.responders {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    margin: 12px;
}

@media (max-width: 768px) {
    
    .month-header, .responders-header {
        font-size: var(--sub_h2);
        font-weight: 700;
    }
}

</style>