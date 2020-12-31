'use strict'

const Project = use('App/Models/Project');
//const AuthorizationService = use('App/Services/AuthorizationService');


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ auth, response }) {

    try {
      const user = await auth.getUser();

      const projects = await user.projects().fetch();
      response.status(200).send({
        projects,
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
  async store({ request, auth, response }) {
    try {
      const user = await auth.getUser();
      const { title } = request.post();

      const project = new Project();
      project.fill({
        title,
      });
      await user.projects().save(project);
      response.status(200).send({
        project,
        message: 'Successfully Added project'
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
      
      response.status(200).send(project);
      

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
      const {title}= request.post();
      const project = await Project.find(id);


      if(!project){
        return response.status(404).json({
          message: 'resource not found'
        });
      }
      else if (project.user_id !== user.id) {
        response.status(403).json({
          message: 'invalid access'
        });
      }
      project.merge({title});
      await project.save();
      
      response.status(200).send({
        data: 'successfully updated a project'
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
      const project = await Project.find(id);
      //console.log(user)
      //console.log(project)
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

      await project.delete();
      response.status(200).send({
        project,
        message: 'Successfully deleted project',
      });

      
    } catch (error) {
      response.status(error.status | 500).send(error);
    }
  }
}

module.exports = ProjectController
