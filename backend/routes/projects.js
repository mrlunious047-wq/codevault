const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Project = require('../models/Project')
const { body, validationResult } = require('express-validator')
const JSZip = require('jszip')
const archiver = require('archiver')

// Get all projects for user
router.get('/', auth, async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user.id })
      .sort({ updatedAt: -1 })
      .select('-files.content')
    
    res.json({
      success: true,
      projects
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Get single project
router.get('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    res.json({
      success: true,
      project
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Create new project
router.post('/', [
  auth,
  body('name').notEmpty().withMessage('Project name is required'),
  body('description').optional(),
  body('template').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() })
    }

    const { name, description, template } = req.body

    const project = new Project({
      name,
      description,
      user: req.user.id,
      files: template ? template.files : [{
        name: 'index.html',
        content: '<!DOCTYPE html>\n<html>\n<head>\n    <title>New Project</title>\n</head>\n<body>\n    <h1>Welcome to CodeVault</h1>\n</body>\n</html>',
        language: 'html'
      }]
    })

    await project.save()

    res.status(201).json({
      success: true,
      project
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Update project
router.put('/:id', auth, async (req, res) => {
  try {
    const { files, name, description } = req.body

    const project = await Project.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      {
        $set: {
          files,
          name,
          description,
          updatedAt: Date.now()
        }
      },
      { new: true }
    )

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    // Emit real-time update
    req.app.get('io').to(req.params.id).emit('project-update', project)

    res.json({
      success: true,
      project
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Delete project
router.delete('/:id', auth, async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    res.json({
      success: true,
      message: 'Project deleted'
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Download project as ZIP
router.get('/:id/download', auth, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.id,
      user: req.user.id
    })

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      })
    }

    const zip = new JSZip()
    
    // Add files to ZIP
    project.files.forEach(file => {
      zip.file(file.name, file.content)
    })

    // Add README
    zip.file('README.md', `# ${project.name}\n\nGenerated with CodeVault AI\n\n## Project Details\n- Created: ${project.createdAt}\n- Last Updated: ${project.updatedAt}\n\n## Files\n${project.files.map(f => `- ${f.name}`).join('\n')}`)

    const zipContent = await zip.generateAsync({ type: 'nodebuffer' })

    res.setHeader('Content-Type', 'application/zip')
    res.setHeader('Content-Disposition', `attachment; filename="${project.name.replace(/\s+/g, '-').toLowerCase()}.zip"`)
    res.send(zipContent)
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

module.exports = router
