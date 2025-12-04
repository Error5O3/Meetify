<template>
    <div class="location-container">
        <div class="locations">
            <div
            v-for="location in sortedLocations"
            :key="location.id"
            :class="['location', {'top':isTop(location)}]">

                <!-- <div v-if="location.imageURL" class="image" :style="{'backgroundImage':`url(${location.imageURL})`}"></div> -->

                <div class="location-text">
                    <div class="name-wrapper">
                        <h4 class="location-name">{{ location.name }}</h4>
                    </div>

                    <div v-if="location.link" class="link" @click="handleTab(location.link)">{{ location.link }}</div>
                    <!-- <div v-if="location.stars" class="stars">
                        <span v-for="n in Math.floor(location.stars)" :key = n>
                            <span class="material-icons">star</span>
                        </span>
                        <span v-for="n in 5-Math.floor(location.stars)" :key = n>
                            <span class="material-symbols-outlined">star</span>
                        </span>
                        [{{ location.stars }}]
                    </div>
                    <div v-if="location.priceMin && location.priceMax" class="price-range">
                        ${{ location.priceMin }}-{{ location.priceMax }} per person
                    </div> -->
                </div>

                <div :class="['likes', { 'liked': likes.has(location.location_id)}]">
                    {{ location.likes }}
                    <span @click="removeLike(location.location_id)" v-show="likes.has(location.location_id)" class="material-icons">thumb_up</span>
                    <span @click="addLike(location.location_id)" v-show="!likes.has(location.location_id)" class="material-symbols-outlined">thumb_up</span>
                </div>

            </div>
        </div>
    </div>
</template>

<script>

export default {
  name: 'LocationList',
  data() {
    return {
        //dummy location data
        // locations: [{'name':'Steve\'s Lava Chicken Shack', 'stars':'4.6', 'priceMin':'10','priceMax':'20', 'likes':'3', 'pressed':'false'},
        //             {'name':'Bobby\'s Shack', 'likes':'2','pressed':'false', 'imageURL':'imageURL'},
        //             {'name':'Steve\'s Lava Chicken', 'stars':'4.6', 'priceMin':'10','priceMax':'20', 'likes':'1', 'pressed':'false', 'imageURL':'imageURL'},
        //             {'name':'Kazu Mori', 'likes':'3','pressed':'false', 'imageURL':'imageURL'},
        // ],
        locations:[],
        likes: new Set(),
        api: 'http://18.222.30.255:8081',
    }
  },
  props: {
    editing: {
    type: Boolean,
    default: false
    },
    userID: {
        type: [Number, null],
        default: null
    }
  },
    async mounted() {
        this.eventID = this.$route.params.id
        await this.fetchData();
    },
  computed: {
    sortedLocations() {
        return [...this.locations].sort((a, b) => b.likes - a.likes);
    },
  },
  expose: ['fetchData'],
  watch: {
    userID: {
      handler(newValue, oldValue) {
        if (newValue !== null && oldValue == null) {
          this.fetchUserLikes();
        }
      },
    }
  },
  methods:{
    async fetchData() {
      //retrive information location data form certain event from database
      let url = `${this.api}/locations/${this.eventID}`
        try {
            const response = await fetch(url);

            if (!response.ok) {
            throw new Error(`${response.status}`);
            }

            this.locations = (await response.json()).locations;
            console.log('Location data retrieved successfully:', this.locations);

        } catch (error) {
            console.error('Error retrieving location data:', error);
        }
    },
    async fetchUserLikes() {
        console.log(this.userID)
        if(this.userID == null) {
            return;
        }

        let url = `${this.api}/likes/${this.userID}`
        try {
            const response = await fetch(url);

            if (!response.ok) {
            throw new Error(`${response.status}`);
            }

            this.likes = new Set((await response.json()).likes);
            console.log('User likes retrieved successfully:', this.likes);

        } catch (error) {
            console.error('Error retrieving user likes data:', error);
        }
    },
    async addLike(id){
        // this.likes[location.id] = true;

        // //call backend to update likes  
        // location.likes++

        let url = `${this.api}/like`

        const data = {
          user_id: this.userID,
          location_id: id
        }

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
            console.log('Liked Location:');
        } catch (error) {
            console.error('Failed to like location:', error);
        }
        

        //fetch the data to populate 
        await this.fetchData()
        await this.fetchUserLikes()
    },
    async removeLike(id){
        // this.likes[location.id] = false;

        // //call backend to update likes
        // location.likes--

        let url = `${this.api}/like`

        const data = {
          user_id: this.userID,
          location_id: id
        }

        try {
            const response = await fetch(url , {
                method: 'DELETE',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })

            if(!response.ok) { 
                throw new Error(`${response.status}`);
            }
            console.log('Unliked Location:');
        } catch (error) {
            console.error('Failed to unlike location:', error);
        }

        //fetch the data to populate 
        await this.fetchData()
        await this.fetchUserLikes()
    },
    isTop(location){
        return location.likes === this.sortedLocations[0].likes
    },
    handleTab(link) {
        window.open(link, '_blank').location.replace(link);
    }
  }
}
</script>

<style scoped>
.location-container {
    width:333px;
    display: flex;
    gap:15px;
    flex-direction: column;
    /* insert height limiter later */
    max-height: 500px;
    overflow: hidden;
}

.locations {
    display: flex; 
    flex-direction: column;
    gap: 15px;
    overflow-y:scroll;
}

.location {
    border: 2px solid var(--mid);
    display: flex; 
    padding: 12px;
    border-radius: 8px;
}

.top {
    border: 2px solid var(--dark_primary);
    background-color: var(--light_primary);
}

.location-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    font-size:var(--detail);
    gap:4px;
    flex: 1 1 auto;
    min-width: 0;
    text-align: left;
    margin-right: 4px;
}

/* .name-wrapper {
    width: 100%;
    overflow: hidden;
} */

.location-name {
    font-size: var(--sub_h1);
    /* white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis; */
}

/* .image + .location-text > h4 {
    width: 150px;
} */

.link {
    cursor: pointer;
    text-decoration: underline;
}

.stars {
    display: flex;
    height: fit-content;
    gap: 2px;
}

.stars > span {
    margin-top: 2px;
}

.stars .material-icons, .stars .material-symbols-outlined {
    font-size: var(--detail);
}

.price-range {
    color: var(--dark)
}

.likes {
    display: flex;
    height: fit-content;
    gap: 4px;
    align-items: center;
    font-size: var(--sub_h1);
    cursor: pointer;
}

.image {
    height: 100%;
    min-height: 100px;
    min-width: 100px;
    object-fit: cover;
    border-radius: 8px;
    background-color: var(--mid);
    margin-right: 12px;
}

.liked {
    color: var(--dark_primary);
}

@media (max-width: 1070px){
    .location-container{
        width:100%;
    }
}

</style>