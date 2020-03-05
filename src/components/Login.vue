<template>
    <v-layout align-center justify-center>
        <v-flex xs12 sm8 md6 lg5 x14> 
            <v-card>
                <v-toolbar dark color="#EB7466">
                    <v-toolbar-title>Acceso al sistema</v-toolbar-title>
                </v-toolbar>
                <v-card-text>
                    <v-layout text-xs-center wrap>
                        <v-flex xs12>
                    <v-img
                        :src="require('../assets/logo.png')"
                        class="my-3"
                        contain
                        height="150"
                    ></v-img>
                    <v-flex mb-4>
                    <h1 class="display-1 font-weight-bold mb-3">
                        Astra 
                    </h1>
                    <p class="subheading font-weight-regular">
                        Impulsando tu negocio
                    </p>
                    </v-flex>
                    </v-flex>
                    </v-layout>
                    <v-text-field v-model="email" autofocus color="accent" label="Email" required></v-text-field>
                    <v-text-field v-model="password" type="password" color="accent" label="Password" required></v-text-field>
                    <v-flex class="red--text" v-if="error">
                        {{error}}
                    </v-flex>
                </v-card-text>
                <v-card-actions class="px-3 pb-3">
                    <v-flex text-xs-right>
                        <v-btn @click="ingresar" color="primary">Ingresar</v-btn>
                    </v-flex>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>
<script>
import axios from 'axios'
export default {
    data(){
        return {
            email: '',
            password: '',
            error:null
        }
    },
    methods:{
        ingresar(){
            this.error =null;
            axios.post('api/user/Login', 
            {email: this.email ,
            password: this.password,
            })
            .then(respuesta => {
                console.log(respuesta.data);
                return respuesta.data;
                
            })
            .then(data => {
                //nos dirigimos a store y activamos mediante dispatch la accion guardarToken enviandole el token del backend
                this.$store.dispatch("guardarToken", data),
                this.$router.push({name:'home'})
                console.log('Hola deberias estar en home');
            })
            .catch(err => {
          
                    this.error="Ocurrio un error";

            })
        }
    }
}
</script>