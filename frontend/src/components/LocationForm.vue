<template>
  <div class="location-container">
    <slot/>
    <LocationList :userID="userID" ref="locationListRef"/>
        <button :class="['add-location-popup', {'disabled':editing}]" 
                @click="() => TogglePopup('buttonTrigger', editing)">
            Add Location
        </button>

    <PopUp 
        v-if="popUpTrigger.buttonTrigger"
        :TogglePopup="() => TogglePopup('buttonTrigger')">
        <div class="location-form">
          <div>
            <p class ="location-header">Add a location</p>
          </div>      
          <div class="location-inputs-container">
              <label for="locationName">Location Name*</label>
              <input 
                  type="text"
                  id="locationName"
                  v-model="locationName"
                  placeholder="Aunt Mary's Beach House"
                  :class="['input-field', 'location-name', {'error-input':!isInitial && !locationLink && !locationName}]"
              />
              <p class="errorMsg" v-if="!isInitial && !locationLink && !locationName">*Please enter a location name.</p>

              <label for="locationLink">Link (optional)</label>
              <input 
              type="url"
              id="locationLink"
              v-model="locationLink"
              placeholder="Google Maps URL"
              class="input-field location-link"
              />
          </div>
          <button class="add-location-button" @click="addLocation">
            Submit
          </button>
          <button class="popup-close" @click="cancel">Cancel</button>
        </div>
    </PopUp>
  </div>
</template>

<script>
import LocationList from './LocationList.vue'
import PopUp from './PopUp.vue';
import {ref} from 'vue';

export default {
  name: 'LocationForm',
  components: {
    LocationList,
    PopUp
  },
  props: {
    editing: {
    type: Boolean,
    default: false
    },
    userID: {
        type: [Number, null],
        default: null
    },
  },
  data() {
    return {
        locationLink: "",
        api: 'http://localhost:8081',
        locationName: "",
        isInitial: true,
    }
  },
  setup(){
    const popUpTrigger = ref({
        buttonTrigger: false,
    })

    const TogglePopup = (trigger, editing) => {
        if(!editing) {
          popUpTrigger.value[trigger] = !popUpTrigger.value[trigger]
        }
    }

    return {
        PopUp,
        popUpTrigger,
        TogglePopup,
    }
  },
  methods: {
    async addLocation() {
        if (!this.locationLink && !this.locationName) {
            this.isInitial = false
            return
        }

        //implement sending information to database
        // this.locations.push({'name':'Kazu Mori', 'likes':'3','pressed':'false', 'imageURL':'imageURL'});
        let url = `${this.api}/location`

        const data = {
          //this one should be taken as an int not string, parse as as int
          event_id: parseInt(this.$route.params.id),
          name: this.locationName,
          link: this.locationLink,
        }
        //check format of data
        console.log(data)

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
            console.log('Location post successful:');
        } catch (error) {
            console.error('Error posting location:', error);
        }


        //pull from database
        await this.$refs.locationListRef.fetchData();

        //clear the form
        this.locationLink = ''
        this.locationName = ''
        this.isInitial = true

        this.TogglePopup('buttonTrigger')
    },
    cancel() {
        //clear any error styling
        this.isInitial = true

        this.TogglePopup('buttonTrigger')
    }
  }
}
</script>

<style scoped>

.location-container {
    min-width: 333px;
    text-align: center;
}

.add-location-popup {
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

.add-location-popup:hover {
  background-color: var(--hover_dark);
}

.location-inputs-container {
    display: flex;
    flex-direction: column;
    
}

.location-header {
  font-size: var(--sub_h1); 
}

.input-field{
  background-color: transparent;
  outline: none;
  font-family: 'Jura', sans-serif;
  font-weight: 700;
  font-size: var(--details);
}

.input-field:focus {
  border: 2px solid var(--primary);
  margin: 0px;
}

.location-form{
  display: flex;
  flex-direction: column;
  gap:16px;
  width: 300px;
}

label {
  margin-bottom: 4px;
  text-align: left;
}

label:not(:first-of-type){
  margin-top: 20px;
}

input {
  border: 1px solid var(--mid);
  margin: 1px;
}

input, button {
  border-radius: 8px;
  padding: 12px;
  color: black;
}

.error-input {
  border: 2px solid red;
  background-color: #ffe6e6;
}

.error-input {
  border: 2px solid red;
  background-color: #ffe6e6;
  margin: 0px;
}

.error-input:focus {
  border: 2px solid red;
}

.errorMsg {
  font-size: 12px;
  text-align: left;
  color: red;
}

.add-location-button {
  font-size: var(--sub_h2);  
  font-family: 'Jura', sans-serif;
  font-weight: 700;
  background: var(--primary);
  border: none;
}

.add-location-button:hover{
  background: var(--hover_dark);
}

.popup-close {
  font-size: var(--sub_h2);  
  font-family: 'Jura', sans-serif;
  font-weight: 700;
  background: var(--light);
  border: none;
}

.popup-close:hover {
  background: var(--mid);
}

.disabled {
  cursor: default;
  opacity: 50%;
}

.disabled:hover {
  background: var(--primary);
}

span {
  text-decoration:underline;
}
</style>