<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
       <v-btn @click="crearPDF"><v-icon>print</v-icon></v-btn>
        <v-toolbar-title>MachineReviews</v-toolbar-title>
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
                            
                            <v-flex xs12 sm12 md12>
                                <v-select v-model="idschedule" :items="schedules" label="Schedule">
                            </v-select>
                            </v-flex>          
                            <v-flex xs6 sm6 md6>
                              <v-text-field v-model="reviewdate" type="date" label="ReviewDate"></v-text-field>
                            </v-flex>
                           <v-flex xs6 sm6 md6>
                              <v-text-field v-model="description" label="Description"></v-text-field>
                            </v-flex>
                                     
                    
                        </v-layout>
                        </v-container>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue darken-1" flat @click="close">Cancelar</v-btn>
                        <v-btn color="blue darken-1" flat @click="guardar">Guardar</v-btn>
                    </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
            <v-data-table :headers="headers" :items="machinereviews" :search="search" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-4" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-4" @click="deleteItem(props.item)">delete</v-icon>
          </td > 
               <td>{{ props.item.nombremaquina}}</td>
                <td >{{ props.item.reviewdate}}</td>
                <td>{{ props.item.description }}</td>


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
                machinereviews:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                    { text: 'nombremaquina', value: 'nombremaquina', sortable: false },
                    { text: 'reviewdate', value: 'reviewdate', sortable: false },
                    { text: 'description', value: 'description', sortable: false },

                ],
                search:'',
                editedIndex: -1,
                //Para crear Order
                id: '',
                idschedule:'',
                schedules:[],
                description:'',
                reviewdate:'',
               
               
            };
        },

        //Evaluar si se registra o se edita
        computed: {
            
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva MachineReview' : 'Actualizar MachineReview';
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
            this.select();
        },

        methods:{

             crearPDF(){
                var columns = [
                    {title: "nombremaquina", dataKey: "nombremaquina"}, 
                    {title: "reviewdate", dataKey: "reviewdate"}, 
                    {title: "Description", dataKey: "description"}, 
                ];
                var rows = [];

                this.machinereviews.map(function(x){
                    rows.push({description:x.description,nombremaquina:x.nombremaquina,reviewdate:x.reviewdate});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de MachineReview", 40, 30);
                    }
                });
                doc.save('MachinesReviews.pdf');
            },
       
            listar(){
                let me = this;
                if(this.$store.state.user.rol == "Admin")
                {
                axios.get("api/machinereview/Get").then(function(response){
                    me.machinereviews = response.data;
                }).catch(function(error){
                    console.log(error);
                })
                }
                else
                {
                     axios.get("api/machinereview/Listarid/"+this.$store.state.user.Id).then(function(response){
                    me.machinereviews = response.data;
                }).catch(function(error){
                    console.log(error);
                })
                }
            },



            select(){
                let me = this;
                var scheduleArray = [];
                axios.get("api/schedule/Select/"+this.$store.state.user.Id).then(function(response){
                   scheduleArray=response.data;
                    scheduleArray.map(function(x){
                        me.schedules.push({text: x.name, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })

            },

            editItem (item) {
                this.id = item.id;
                this.idschedule=item.idschedule;
                this.reviewdate=item.reviewdate;
                this.description = item.description;
                
                
              
                this.editedIndex = 1;
                this.dialog = true;
            },

             deleteItem(item) {   
                 let me = this;
                  axios
                .delete("api/machinereview/"+item.id)
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
                this.idschedule="";
                this.reviewdate="";
                this.description="";
            },

            guardar () {

                if (this.editedIndex > -1) {
                    //Para editar    
                    let me = this;
                    axios.put("api/machinereview",{
                        
                        id:me.id,
                        idschedule:me.idschedule,
                        reviewdate:me.reviewdate,
                        description:me.description,
                    
                        
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    }).catch(function(error){
                        console.log(error);
                    })
                } else {
                    //Para guardar
                    let me = this
                    axios.post("api/machinereview",{
                        idschedule:me.idschedule,
                       reviewdate:me.reviewdate,
                       description:me.description,
                  
                       
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    }).catch(function(error){
                        console.log(error);
                    })
                }

            }
          
        
       
        }        
    }
</script>