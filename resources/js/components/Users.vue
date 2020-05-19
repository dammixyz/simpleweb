<template>
    <div class="container">
        <div class="row justify-content-center mt-3" v-if="$gate.isAdminOrAuthor()">
          <div class="col-12">
            <div class="card">
              <div class="card-header">
                <h3 class="card-title">Users Table</h3>

                <div class="card-tools">
                  <button class="btn btn-primary" @click="addUser()">Add User <i class="fa fa-user-plus"></i></button>
                </div>
              </div>
              <!-- /.card-header -->
              <div class="card-body table-responsive p-0">
                <table class="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Typed</th>
                      <th>Registered at</th>
                      <th>Modify</th>
                    </tr>
                  </thead>
                  
                  <tbody>
                    <tr v-for="user in users.data" :key="user.id">
                      <td>{{user.id}}</td>
                      <td>{{user.name}}</td>
                      <td>{{user.email}}</td>
                      <td>{{user.type | upFirstLetter}}</td>
                      <td>{{user.created_at | fancyDate}}</td>
                      <td>
                        <a @click="editUser(user)" :style="{cursor: 'pointer'}" title="Edit">
                            <i class="fa fa-edit fa-lg blue"></i>
                        </a> / 
                        <a @click="deleteUser(user)" :style="{cursor: 'pointer'}" title="Delete">
                            <i class="fa fa-trash fa-lg red"></i>
                        </a>
                      </td>
                    </tr>
                    
                  </tbody>
                </table>
              </div>
              <!-- /.card-body -->
              <div class="card-footer">
                <pagination :data="users" @pagination-change-page="getResults"></pagination>
              </div>
            </div>
            <!-- /.card -->
          </div>
        </div>
        
        <not-found v-if="!$gate.isAdminOrAuthor()"></not-found>
           
        
        <!-- Modal -->
        <div class="modal fade" id="addUser" tabindex="-1" role="dialog" aria-labelledby="addUserLabel" aria-hidden="true">
          <div class="modal-dialog modal-dialog-centered" role="document">
              <div class="modal-content">
              <div class="modal-header">
                  <h5 class="modal-title" id="addUserLabel">{{editmode ? 'Edit User Details' : 'Add New User'}}</h5>
                  <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <form  @submit.prevent="editmode ? updateUser() : createUser()">
                  <div class="modal-body">
                    
                      <div class="form-group">
                              <input v-model="form.name" type="text" name="name"
                                  placeholder="Name"
                                  class="form-control" :class="{ 'is-invalid': form.errors.has('name') }">
                              <has-error :form="form" field="name"></has-error>
                          </div>

                          <div class="form-group">
                              <input v-model="form.email" type="email" name="email"
                                  placeholder="Email Address"
                                  class="form-control" :class="{ 'is-invalid': form.errors.has('email') }">
                              <has-error :form="form" field="email"></has-error>
                          </div>

                          <div class="form-group">
                              <textarea v-model="form.bio" name="bio" id="bio"
                              placeholder="Short bio for user (Optional)"
                              class="form-control" :class="{ 'is-invalid': form.errors.has('bio') }"></textarea>
                              <has-error :form="form" field="bio"></has-error>
                          </div>


                          <div class="form-group">
                              <select name="type" v-model="form.type" id="type" class="form-control" :class="{ 'is-invalid': form.errors.has('type') }">
                                  <option value="">Select User Role</option>
                                  <option value="admin">Admin</option>
                                  <option value="user">Standard User</option>
                                  <option value="author">Author</option>
                              </select>
                              <has-error :form="form" field="type"></has-error>
                          </div>

                          <div class="form-group">
                              <input v-model="form.password" type="password" name="password" id="password"
                              class="form-control" :class="{ 'is-invalid': form.errors.has('password') }">
                              <has-error :form="form" field="password"></has-error>
                          </div>
                    

                  </div>
                  <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal"><i class="fas fa-times"></i> Close</button>
                      <button type="submit" v-show="editmode" class="btn btn-success"> Update User</button>
                      <button type="submit" v-show="!editmode" class="btn btn-primary"> Create User</button>
                  </div>
              </form>
              </div>    
          </div>
        </div>
    </div>
</template>

<script>
    export default {
      data() {
            return {
                editmode: false,
                users : {},
                form: new Form({
                    id:'',
                    name : '',
                    email: '',
                    password: '',
                    type: '',
                    bio: '',
                    photo: ''
                })
            }
        },
        methods: {
            // Our method to GET results from a Laravel endpoint
            getResults(page = 1) {
              axios.get('api/user?page=' + page)
                .then(response => {
                  this.users = response.data;
                });
            },
            addUser(){
              this.editmode = false
              this.form.reset()
              $('#addUser').modal('show')
            },
            editUser(user){
              this.editmode = true
              $('#addUser').modal('show')
              this.form.fill(user)
            },
            deleteUser(user){
              Swal.fire({
                      title: 'Are you sure?',
                      text: "Delete User: "+user.name+", E-mail: "+user.email,
                      icon: 'warning',
                      showCancelButton: true,
                      confirmButtonColor: '#3085d6',
                      cancelButtonColor: '#d33',
                      confirmButtonText: 'Yes, delete it!'
                    }).then((result) => {
                      if (result.value) {
                        this.form.delete("api/user/"+user.id)
                        .then(
                          () => {
                            Swal.fire(
                              'Deleted!',
                              'User has been deleted.',
                              'success'
                            )
                            //Emit Reload User Page
                            Fire.$emit('reloadUserPage')
                          })
                        .catch(
                          () => {
                              Toast.fire({
                                icon: 'error',
                                title: 'Fatal ERROR has ocuured'
                              })
                          })
                        
                      }
                    })
                
              
            },
            loadUsers(){
              if (this.$gate.isAdminOrAuthor()) {
                axios.get("api/user").then(({data}) => (this.users = data))
              }
              
            },
            createUser(){
              //  start the progress bar
              this.$Progress.start()
              //Make post request
              this.form.post('api/user')
              .then(
                () => {
                  //Hide  after request has been sent
                  $('#addUser').modal('hide')

                  //SweetAlert2
                  Toast.fire({
                              icon: 'success',
                              title: 'User Added Successfully'
                            })
                 //  finish the progress bar
                this.$Progress.finish()
                }
                )
                .catch(
                  () => {
                    this.$Progress.fail()
                  }
                )
                //Emit Reload User Page
                Fire.$emit('reloadUserPage')
            },
            updateUser(){
                //  start the progress bar
                this.$Progress.start()
                this.form.put('api/user/'+this.form.id)
                .then(() => {
                    //Hide  after request has been sent
                    $('#addUser').modal('hide')

                   Swal.fire(
                              'Updated!',
                              'User has been updated.',
                              'success'
                            )
                //Emit Reload User Page
                Fire.$emit('reloadUserPage')
                })
                .catch(() => {
                  this.$Progress.fail()
                })
                //  finish the progress bar
                this.$Progress.finish()
              },
            
        },
        
        mounted() {
            console.log('Component mounted.')
            
        },
        created() {
          Fire.$on('searching', () => {
            let query = this.$parent.search
            axios.get('api/findUser?q='+query)
            .then((data) => {
                this.users = data.data
            })
            .catch(() => {

            })
          })
            this.loadUsers();
            Fire.$on('reloadUserPage', () => {this.loadUsers()})

            //setInterval(() => {this.loadUsers()}, 3000) // load user page every 3secs
        }
    }
</script>
