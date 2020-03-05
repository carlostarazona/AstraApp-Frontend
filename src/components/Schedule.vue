<template>
    <!--Para alinear el contenido-->
    <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
           <v-btn @click="crearPDF"><v-icon>print</v-icon></v-btn>
        <v-toolbar-title>Schedules</v-toolbar-title>
        <v-divider class="mx-2" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-text-field
          class="text-xs-center"
          v-model="search"
          append-icon="search"
          label="Búsqueda"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <v-btn slot="activator" color="primary" dark class="mb-2">Nuevo</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>
                             <v-flex xs6 sm6 md6>
                              <v-text-field v-model="name" label="Name"></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                              <v-text-field v-model="agreeddate" type="date" label="AgreedDate"></v-text-field>
                            </v-flex>
                            <v-flex xs6 sm6 md6>
                              <v-text-field v-model="arrivaldate" type="date" label="ArrivalDate" ></v-text-field>
                            </v-flex>
                             <v-flex xs6 sm6 md6>
                                <v-select v-model="idorder" :items="orders" label="Order">
                            </v-select>
                            </v-flex>
                             <v-flex xs6 sm6 md6>
                                <v-select v-model="iduser" :items="users" label="User">
                            </v-select>
                            </v-flex>
                         
                           
                    
                        </v-layout>
                        </v-container>
                    </v-card-text>

             <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" flat @click.native="close">Cancelar</v-btn>
              <v-btn color="blue darken-1" flat @click.native="guardar">Guardar</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
      <v-data-table :headers="headers" :items="schedules" :search="search" class="elevation-1">
            <template slot="items" slot-scope="props">
                <td class="justify-center layout px-0">
            <v-icon small class="mr-4" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-4" @click="deleteItem(props.item)">delete</v-icon>
            </td>
                <td>{{ props.item.name }}</td>
                <td>{{ props.item.agreeddate }}</td>
                <td>{{ props.item.arrivaldate }}</td>
                <td>{{ props.item.descriptionorder }}</td>
                <td>{{ props.item.nombremedicalequipment }}</td>
                <td>{{ props.item.hospitaluser }}</td>
    
            
           </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
         </v-data-table>
        </v-flex> 
    </v-layout>
</template>

<script>
    import axios from 'axios';
     import jsPDF from 'jspdf';
    import autoTable from 'jspdf-autotable';
    export default {
        data(){
            return{
                schedules:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'name', value: 'name', sortable: false },
                    { text: 'agreeddate', value: 'agreeddate', sortable: false },
                    { text: 'arrivaldate', value: 'arrivaldate', sortable: false },
                    { text: 'Descriptionorder', value: 'descriptionorder', sortable: false },
                    { text: 'Nombremedicalequipment', value: 'nombremedicalequipment', sortable: false },
                    { text: 'Hospitaluser', value: 'hospitaluser', sortable: false }, 
                ],
                search:'',
                editedIndex: -1,
                //Para crear Order
                id: '',
                name:'',
                iduser:'',
                users:[],
                idorder:'',
                orders:[],
                agreeddate:'',
                arrivaldate:'',
               
            };
        },

        //Evaluar si se registra o se edita
        computed: {
            
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva Schedule' : 'Actualizar Schedule';
            }
        },

        watch: {
            dialog (val) {
            val || this.close();
            }
        },

        created () {
            //Esta propiedad es la primera que se ejecuta al iniciar
            this.listar();
            this.selectuser();
            this.selectorder();

        },

        methods:{
        
        crearPDF(){
                var columns = [
                    {title: "Name", dataKey: "name"}, 
                    {title: "Agreeddate", dataKey: "agreeddate"}, 
                    {title: "Arrivaldate", dataKey: "arrivaldate"}, 
                    {title: "Descriptionorder", dataKey: "descriptionorder"}, 
                    {title: "Nombremedicalequipment", dataKey: "nombremedicalequipment"}, 
                    {title: "Hospitaluser", dataKey: "hospitaluser"}, 
            
                ];
                var rows = [];

                this.schedules.map(function(x){
                    rows.push({name:x.name,agreeddate:x.agreeddate,arrivaldate:x.arrivaldate,descriptionorder:x.descriptionorder,nombremedicalequipment:x.nombremedicalequipment,hospitaluser:x.hospitaluser});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de Schedules", 40, 30);
                    }
                });
                doc.save('Schedule.pdf');
            },


            listar()
            {
                let me = this;
                
                if(this.$store.state.user.rol == 'Admin' )
                {
                axios.get("api/schedule/Get").then(function(response){
                    me.schedules = response.data;
                }).catch(function(error){
                    console.log(error);
                })
                }
                else
                {
                    axios.get("api/schedule/Listarid/"+this.$store.state.user.Id).then(function(response){
                    me.schedules = response.data;
                }).catch(function(error){
                    console.log(error);
                })

                }
            },
            selectuser(){
                let me = this;
                var userArray = [];
                axios.get("api/user/Select").then(function(response){
                   userArray=response.data;
                    userArray.map(function(x){
                        me.users.push({text: x.name, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })
            },

            selectorder()
            {
                let me = this;
                var orderArray = [];
                axios.get("api/order/Select/"+this.$store.state.user.Id).then(function(response){
                   orderArray=response.data;
                    orderArray.map(function(x){
                        me.orders.push({text: x.description, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })

            },

            editItem (item) {
                this.id = item.id;
                this.name = item.name;
                this.iduser=item.iduser;
                this.idorder=item.idorder;
                this.agreeddate=item.agreeddate;
                this.arrivaldate = item.arrivaldate;
                
              
                this.editedIndex = 1;
                this.dialog = true;
            },

             deleteItem(item) {   
                 let me = this;
                     axios
                .delete("api/schedule/"+ item.id)
                .then(function(response){
                        me.listar();
                        me.limpiar();
                        })
            },

            close () {
                this.dialog = false;

            },

            limpiar(){
                this.id="";
                this.name="";
                this.iduser="";
                this.idorder="";
                this.agreeddate="";
                this.arrivaldate ="";
            },

            guardar () {
                if (this.editedIndex > -1) {
                    //Para editar    
                    let me = this;
                    axios.put("api/schedule",{
                        id:me.id,
                        name:me.name,
                        iduser:me.iduser,
                        idorder:me.idorder,
                        agreeddate:me.agreeddate,
                        arrivaldate:me.arrivaldate,
                  
                        
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    }).catch(function(error){
                        console.log(error);
                    });
                } else {
                    //Para guardar
                    let me = this;
                    axios.post("api/schedule",{
                        name:me.name,
                        iduser:me.iduser,
                        idorder:me.idorder,
                        agreeddate:me.agreeddate,
                        arrivaldate:me.arrivaldate,
                  
                       
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    }).catch(function(error){
                        console.log(error);
                    });
                }
            }
               
        }        
    };
</script>