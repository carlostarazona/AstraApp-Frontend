<template>
    <!--Para alinear el contenido-->
    <v-layout align-start>
       <v-flex>
            <v-toolbar flat color="white">
                <v-btn @click="crearPDF"><v-icon>print</v-icon></v-btn>
                <v-toolbar-title>FinalReport</v-toolbar-title>
                <v-divider
                    class="mx-2"
                    inset
                    vertical
                ></v-divider>
                <v-spacer></v-spacer>
                <v-text-field class="text-xs-center" v-model="search" append-icon="search" label="Busqueda" single-line hide-details></v-text-field>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" max-width="500px">
                    <template v-slot:activator="{ on }">
                    <v-btn color="primary" dark class="mb-2" v-on="on">Nuevo</v-btn>
                    </template>
                    <v-card>
                    <v-card-title>
                        <span class="headline">{{ formTitle }}</span>
                    </v-card-title>

                    <v-card-text>
                        <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs12 sm12 md12>
                                <v-select v-model="idmachinereview" :items="machinereviews" label="MachineReview">
                                </v-select>
                            </v-flex>
                           <v-flex xs12 sm12 md12>
                            <v-text-field v-model="description" label="Description"></v-text-field>
                            </v-flex>
                             <v-flex xs12 sm12 md12>
                            <v-text-field v-model="reportdate" type="date" label="ReportDate"></v-text-field>
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
    <v-data-table :headers="headers" :items="finalreports" :search="search" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
          </td>
             <td>{{ props.item.nombremaquina }}</td>
             <td>{{ props.item.description }}</td>
             <td>{{ props.item.reportdate }}</td>

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
                finalreports:[],
                dialog: false,
                headers: [
                    { text: 'Opciones', value: 'opciones', sortable: false },
                     { text: 'nombremaquina', value: 'nombremaquina', sortable: false },
                    { text: 'description', value: 'description', sortable: false },
                    { text: 'reportdate', value: 'reportdate', sortable: false },
                         
                ],
                search:'',
                editedIndex: -1,
                //Para crear Order
                id: '',
                idmachinereview:'',
                machinereviews:[],
                descripcion:'',
                reportdate:'',
            }
        },

        //Evaluar si se registra o se edita
        computed: {
            
            formTitle () {
            return this.editedIndex === -1 ? 'Nueva FinalReport' : 'Actualizar FinalReport';
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
                    {title: "Description", dataKey: "description"}, 
                    {title: "ReportDate", dataKey: "reportdate"}, 
            
                ];
                var rows = [];

                this.finalreports.map(function(x){
                    rows.push({description:x.description,nombremaquina:x.nombremaquina,reportdate:x.reportdate});
                });

                // Only pt supported (not mm or in)
                var doc = new jsPDF('p', 'pt');
                doc.autoTable(columns, rows, {
                    margin: {top: 60},
                    addPageContent: function(data) {
                        doc.text("Listado de FinalReports", 40, 30);
                    }
                });
                doc.save('FinalReports.pdf');
            },
       
            listar(){
                let me = this;
                if(this.$store.state.user.rol == "Admin")
                {
                axios.get("api/finalreport/Get").then(function(response){
                    me.finalreports = response.data;
                }).catch(function(error){
                    console.log(error);
                })
                }
                else
                {
                     axios.get("api/finalreport/Listarid/"+this.$store.state.user.Id).then(function(response){
                    me.finalreports = response.data;
                }).catch(function(error){
                    console.log(error);
                })
                }
            },
            select(){
                let me = this;
                var machinereviewArray = [];
                axios.get("api/machinereview/Select").then(function(response){
                   machinereviewArray=response.data;
                    machinereviewArray.map(function(x){
                        me.machinereviews.push({text: x.nombremaquina, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })
            },

            editItem (item) {
                this.id = item.id;
                this.idmachinereview=item.idmachinereview;
                this.description = item.description;
                this.reportdate = item.reportdate;
              
                this.editedIndex = 1;
                this.dialog = true;
            },
            deleteItem(item) {   
                let me = this;
                 axios
                 .delete("api/finalreport/"+item.id)
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
                this.idmachinereview="";
                this.description="";
                this.reportdate="";
            },

            guardar () {
                if (this.editedIndex > -1) {
                    //Para editar

                    let me = this
                    axios.put("api/finalreport",{
                        id:me.id,
                        idmachinereview:me.idmachinereview,
                        description:me.description,
                        reportdate:me.reportdate,
                        
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
                    axios.post("api/finalreport",{
                        idmachinereview:me.idmachinereview,
                        description:me.description,
                        reportdate:me.reportdate,
                       
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
    };
</script>