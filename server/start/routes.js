'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Backend for our Todo App is running :)' }
})


Route.group(()=>{
  Route.post('register', 'UserController.register');
  Route.post('login', 'UserController.login');
}).prefix('v1/auth')


Route.group(()=>{
  Route.get('/', 'ProjectController.index').middleware('auth');
  Route.put('/', 'ProjectController.store').middleware('auth');
  Route.get('/:id', 'ProjectController.show').middleware('auth');
  Route.post('/:id', 'ProjectController.update').middleware('auth');
  Route.delete('/:id', 'ProjectController.destroy').middleware('auth');
}).prefix('v1/project')

Route.group(()=>{
  Route.get('/all', 'TaskController.index').middleware('auth');
  Route.put('/add', 'TaskController.store').middleware('auth');
}).prefix('v1/project/:id')

Route.group(()=>{
  Route.get('/:id', 'TaskController.show').middleware('auth');
  Route.post('/:id', 'TaskController.update').middleware('auth');
  Route.delete('/:id', 'TaskController.destroy').middleware('auth');
}).prefix('v1/task')