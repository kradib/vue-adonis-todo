'use strict'


const Task = use('App/Models/Task');
const Project = use('App/Models/Project');
//const AuthorizationService = use('App/Services/AuthorizationService');


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with projects
 */
class TaskController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, response, params: {id} }) {

    try {
      const user = await auth.getUser();
      const project = await Project.find(id);
      if(!project){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      else if (project.user_id !== user.id) {
        return response.status(403).json({
          message: 'invalid access'
        });
      }
      const tasks = await project.tasks().fetch();
      return response.status(200).send({
        tasks,
        message: 'Successfully fetched all projects'
      })

    } catch (error) {
      response.status(error.status | 500).send(error);
    }


  }


  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, auth, response, params : {id} }) {
    try {
      const {description, completed} = request.post();
      const user = await auth.getUser();
      const project = await Project.find(id);
      
      if(!project){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      else if (project.user_id !== user.id) {
        return response.status(403).json({
          message: 'invalid access'
        });
      }

      const task = new Task();
      task.fill({
        description,
        completed
      })

      await project.tasks().save(task);

      return response.status(200).send({
        task,
        message: 'Successfully created a task'
      })
    } catch (error) {
      response.status(error.status | 500).send(error);
    }


  }

  /**
   * Display a single project.
   * GET projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params: { id }, request, response, auth }) {
    try {

      const user = await auth.getUser();
      const task = await Task.find(id);
      if(!task){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      const project = await task.project().fetch();
      if (project.user_id !== user.id) {
        return response.status(403).json({
          message: 'invalid access'
        });
      }
      
      return response.status(200).send(task);
      

    } catch (error) {
      response.status(error.status | 500).send(error);
    }
  }

  
  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params:{id}, request, response , auth}) {
    
    try {
      const user = await auth.getUser();
      const task = await Task.find(id);
      const {description, completed} = request.post();
      if(!task){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      const project = await task.project().fetch();
      if (project.user_id !== user.id) {
        return response.status(403).json({
          message: 'invalid access'
        });
      }
      await task.merge({description, completed});
      await task.save();
      
      response.status(200).send({
        data: 'successfully updated the task'
      });
    

    } catch (error) {
      response.status(error.status | 500).send(error);
    }
  
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params: {id}, request, response, auth }) {
    try {
      const user = await auth.getUser();
      const task = await Task.find(id);
      
      if(!task){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      const project = await task.project().fetch();
      if (project.user_id !== user.id) {
        return response.status(403).json({
          message: 'invalid access'
        });
      }
      await task.delete();
      response.status(200).send({
        project,
        message: 'Successfully deleted project',
      });

    } catch (error) {
      response.status(error.status | 500).send(error);
    }
  }
}

module.exports = TaskController
