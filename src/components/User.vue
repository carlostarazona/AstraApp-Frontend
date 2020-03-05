<template>
  <v-layout align-start>
    <v-flex>
      <v-toolbar flat color="white">
        <v-toolbar-title>Users</v-toolbar-title>
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
                    <v-text-field v-model="name" label="Name"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm6 md6>
                        <v-select v-model="idrol" :items="roles" label="Role">
                    </v-select>
                    </v-flex>
                    <v-flex xs6 sm6 md6>
                      <v-select v-model="idhospital" :items="hospitalusers" label="Hospitaluser">
                      </v-select>
                   </v-flex>
                   <v-flex xs6 sm6 md6>
                      <v-select v-model="idarea" :items="areausers" label="AreaUser">
                      </v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-select v-model="typedoc" :items="document" label="Typedoc">
                    </v-select>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="numdoc" label="Numdoc"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                    <v-text-field v-model="phone" label="Phone"></v-text-field>
                  </v-flex>
                  <v-flex xs12 sm12 md12>
                    <v-text-field v-model="email" type ="email" label="email"></v-text-field>
                  </v-flex>
                   <v-flex xs12 sm12 md12>
                      <v-text-field v-model="password"  type="password" label="Password"></v-text-field>
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
      <v-data-table :headers="headers" :items="users" :search="search" class="elevation-1">
        <template slot="items" slot-scope="props">
          <td class="justify-center layout px-0">
            
            <v-icon small class="mr-2" @click="editItem(props.item)">edit</v-icon>
            <v-icon small class="mr-4" @click="deleteItem(props.item)">delete</v-icon>
          </td>
          <td>{{ props.item.name }}</td>
          <td>{{ props.item.namerol }}</td>
          <td>{{ props.item.namehospital}}</td>
          <td>{{ props.item.namearea}}</td>
          <td>{{ props.item.typedoc }}</td>
          <td>{{ props.item.numdoc }}</td>
          <td>{{ props.item.phone }}</td>
          <td>{{ props.item.email }}</td>
        </template>
        <template slot="no-data">
          <v-btn color="primary" @click="listar">Resetear</v-btn>
        </template>
      </v-data-table>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from "axios";
export default {
  data() {
    return {
      users: [],
      dialog: false,
      headers: [
        { text: "Opciones", value: "opciones", sortable: false },
        { text: "Name", value: "name", sortable: false },
        { text: 'namerol', value: 'namerol', sortable: false },
        { text: 'namehospital', value: 'namehospital', sortable: false },
        { text: 'namearea', value: 'namearea', sortable: false },
        { text: "Typedoc", value: "typedoc",sortable: false },
        { text: "Numdoc", value: "numdoc" , sortable: false },
         { text: "Phone", value: "phone", sortable: false  },
        { text: "Email", value: "email", sortable: false  }
        
      ],
      search: "",
      editedIndex: -1,

      //Model
      id: "",
      name: "",
      idrol: "",
      idhospital: "",
      idarea: "",
      roles:[],
      hospitalusers:[],
      areausers:[],
      typedoc: "",
      document:['DNI', 'RUC', 'PASAPORTE', 'CEDULA'],
      numdoc: "",
      phone: "",
      email: "",
      password:'',
      actPassword: false,
      passwordAnt:'',

    };
  },
  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo User" : "Actualizar User";
    }
  },

  watch: {
    dialog(val) {
      val || this.close();
    }
  },

  created() {
    this.listar();
    this.select();
    this.selecthospital();
    this.selectarea();
  },
  methods: {
    listar() {
      let me = this;
      axios
        .get("api/user")
        .then(function(response) {
          //console.log(response);
          me.users = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    },
     select(){
               let me = this;
                var rolesArray = [];
                axios.get("api/role/select").then(function(response){
                    rolesArray=response.data;
                    rolesArray.map(function(x){
                        me.roles.push({text: x.namerole, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })
            },

      selecthospital(){
               let me = this;
                var HospitalArray = [];
                axios.get("api/user/SelectHospital").then(function(response){
                    HospitalArray=response.data;
                    HospitalArray.map(function(x){
                        me.hospitalusers.push({text: x.namehospital, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })
            },

        selectarea(){
               let me = this;
                var AreaArray = []
                axios.get("api/user/SelectArea").then(function(response){
                    AreaArray=response.data;
                    AreaArray.map(function(x){
                        me.areausers.push({text: x.namearea, value:x.id})
                    })
                }).catch(function(error){
                    console.log(error);
                })
            },

    editItem(item) {
      this.id = item.id;
      this.name = item.name;
      this.idrol = item.idrol;
      this.idhospital= item.idhospital;
      this.idarea = item.idarea;
      this.typedoc = item.typedoc;
      this.numdoc = item.numdoc;
      this.phone = item.phone;
      this.email = item.email;
      this.password = item.password_hash;
      this.passwordAnt = item.password_hash;

      this.editedIndex = 1;
      this.dialog = true;
    },

     deleteItem(item) {   
       let me = this;
          axios
        .delete("api/user/"+item.id)
        .then(function(response){
                        me.listar();
                        me.limpiar();
                    })
     },

  

    close() {
      this.dialog = false;
    },
    limpiar() {
       this.id = "";
      this.name = "";
      this.idrol = "";
      this.idhospital = "";
      this.idarea = "";
      this.typedoc = "";
      this.numdoc = "";
      this.phone = "";
      this.email = "";
      this.password="";
      this.passwordAnt="";
      this.actPassword=false;
     
    },
      guardar () {
           
    
                if (this.editedIndex > -1) {
                    //Para editar
                    let me = this;

                      if(me.password!=me.passwordAnt){
                        me.actPassword = true;
                    }

                    axios.put('api/user',{
                        id:me.id,
                        idrol:me.idrol,
                        idhospital:me.idhospital,
                        idarea:me.idarea,
                        name:me.name,
                        typedoc:me.typedoc,
                        numdoc:me.numdoc,
                        phone:me.phone,
                        email:me.email,
                        password:me.password,
                        act_password:me.actPassword,
                    }).then(function(response){
                        me.close();
                        me.listar();
                        me.limpiar();
                    }).catch(function(error){
                        console.log(error);
                    })
                } else {
                    //Para guardar
                    let me = this;

                    axios.post('api/user/Save',{
                        idrol:me.idrol,
                        idhospital:me.idhospital,
                        idarea:me.idarea,
                        name:me.name,
                        typedoc:me.typedoc,
                        numdoc:me.numdoc,
                        phone:me.phone,
                        email:me.email,
                        password:me.password,
                        
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
