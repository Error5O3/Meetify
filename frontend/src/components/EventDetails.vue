<template>
  <div class="event-details-container">
    <div class="event-details">
      <div class="details event-name">
        {{ eventName }}
      </div>

      <!-- <div class="details event-description">
        {{ eventDesc }}
      </div> -->
    </div>
    <PopUp
      v-if="signInPopUp.signInTrigger"
      :ToggleSignIn="() => ToggleSignIn('signInTrigger')">
      <div class="sign-in-form">
        <p class="sign-in-header">Sign In</p>
        <p class="sign-in-instructions">Name/Password <span>only for this event.</span></p>
        
        <div class="sign-inputs-container">
          <label for="username">Name*</label>
          <input 
          type="text"
          id="username"
          v-model="username"
          :class="['input-field', 'name', {'error-input':!isInitial && !name}]"
          />
          <p class="errorMsg" v-if="!isInitial && !name">*Please enter a name.</p>

          <label for="password">Password (optional)</label>
          <input 
          type="password"
          id="password"
          v-model="password"
          class="input-field password"
          />
        </div>

        <p class="sign-in-instructions">
          <span>New?</span> Give yourself a name!<br>
          <span>Editing?</span> Reuse same name/password!
        </p>

        <button type="submit" class="sign-in-button" @click="signIn">
            Sign In
        </button>
      </div>
    </PopUp>

    <div class="widget-nav">
      <div class="avail tab" @click="tab = true">
        Availabilities
        <div class="tab-select" :style="[{'background-color': tab ? 'var(--primary)' : 'var(--mid)'}]"></div>
      </div>
      <div :class="['location', 'tab', {'disabled':editing}]" @click="tab = !editing ? false : true ">
        Locations
        <div class="tab-select" :style="[{'background-color': !tab ? 'var(--primary)' : 'var(--mid)'}]"></div>
      </div>
    </div>

    <div class="widgets"> 
      <AvaliabilityWidget 
        class="avail-widget" 
        :style="[{display: (tab || width > 1070) ? 'block' : 'none'}]" 
        :editing="editing" 
        @update:editing="editing = $event"
        :userID="userID"
        :eventName="eventName"
        @update:eventName="eventName = $event"
        >
        <h3 class="widget-header">Availabilities</h3>
      </AvaliabilityWidget>
      <LocationForm class="location-widget" 
                    :style="[{display: (!tab || width > 1070) ? 'block' : 'none'}]" 
                    :editing="editing"
                    :userID="userID">
        <h3 class="widget-header">Locations</h3>
      </LocationForm>
    </div>
  </div>
</template>

<script>
import AvaliabilityWidget from './AvaliabilityWidget.vue';
import LocationForm from './LocationForm.vue'
import PopUp from './PopUp.vue'
import {ref} from 'vue';

export default {
  components: { LocationForm, PopUp, AvaliabilityWidget },
  name: 'EventDetails',
  async mounted() {
      window.addEventListener('resize', this.setWidth);
  },
  beforeUnmount() {
      window.removeEventListener('resize', this.setWidth);
  },
  setup(){
    const signInPopUp = ref({
        signInTrigger: true,
    })

    const ToggleSignIn = (trigger) => {
        signInPopUp.value[trigger] = !signInPopUp.value[trigger]
    }

    return {
        PopUp,
        signInPopUp,
        ToggleSignIn
    }
  },
  data() {
    return {
      username: '',
      password: '',
      isInitial: true,
      tab:true,
      width: window.innerWidth,
      eventName: '',
      //eventDesc: '',
      eventID: '',
      editing: false,
      api: 'http://18.222.30.255:8081',
      eventData: {},
      userID: null,
      userData: null,
    }
  },
  methods: {
    setWidth() {
      this.width = window.innerWidth;
    },
    async signIn() {
      if (!this.username) {
        this.isInitial = false
        return
      }
      //call backend to fetch the avaliability data
      await this.fetchUserID()

      //after it is done, remove the sign in popup
      this.ToggleSignIn('signInTrigger')

    },
    async fetchUserID() {
      const data = {
        // just using the username to sign in right now
        username: this.username,
        // password: this.password
      }

      //try to sign up user
      let url = `${this.api}/signup`
      try {
        const response = await fetch(url , {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          // we convert into a JSON string to sent to the backend
          body: JSON.stringify(data)
        })

        //if sign up fail, try to login user
        if (!response.ok) {
          let url = `${this.api}/login`
           const response = await fetch(url , {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            // we convert into a JSON string to sent to the backend
            body: JSON.stringify(data)
          })

          if(!response.ok) { //sign up and login fail
            throw new Error(`${response.status}`);
          }
          let result = await response.json();
          console.log('User successfully logged in:', result);

          this.userID = result.id;

        } else {
          let result = await response.json();
          console.log('User successfully created:', result);
          this.userID = result.id;
        }
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }

    },
  }
}
</script>

<style scoped>

.event-details-container {
  width: 70%;
  min-width: 333px;
  margin: 0 auto;
  padding-top: 40px;
  padding-bottom: 40px;
}

.details {
  width: 100%;
  padding-bottom: 8px;
  font-size: var(--sub_h2);
}

.widget-header {
    font-size: var(--heading);
    text-align: center;
    margin-bottom: 15px;
}

.widgets {
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 60px;
}

.event-details {
  padding-bottom: 25px;
}

.event-name{
  font-size: var(--heading);
  color: black;
}

.event-description {
  margin-top: 25px;
  font-size: var(--detail);
  color: var(--mid);
}

.sign-in-form{
  display: flex;
  flex-direction: column;
  gap:16px;
  text-align: center;
}

.sign-inputs-container {
  display: flex;
  flex-direction: column;
}

.sign-in-header {
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

.sign-in-button {
  font-size: var(--sub_h2);  
  font-family: 'Jura', sans-serif;
  font-weight: 700;
  background: var(--primary);
  border: none;
}

.sign-in-button:hover{
  background: var(--hover_dark);
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

span {
  text-decoration:underline;
}

.widget-nav {
  display: none;
}

@media (max-width: 1330px) {
  .event-details-container {
    width: 75%;
  }
}

@media (max-width: 1070px){
  .event-details-container {
    width: 80%;
    min-width: 333px;
  }

  .widget-header {
    display: none;
  }

  .location-widget {
    width: 100%;
  }

  .widget-nav {
    display: flex;
    justify-content: space-around;
    font-size: var(--sub_h1);
  }

  .tab {
    display: flex;
    justify-content: center;
    flex-direction: column;
    text-align: center;
    margin-bottom: 15px;
    cursor: pointer;
  }

  .tab-select {
    height: 10px;
    width: 100%;
    border-radius: 8px 8px 0 0;
  }

  .disabled {
    cursor: default;
    opacity: 50%;
  }
}

@media (max-width: 768px) {

}

@media (max-width:464px) {

}

</style>