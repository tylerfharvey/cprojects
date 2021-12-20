import React from 'react';
import ReactDOM from 'react-dom';
//import https from 'https';
import './index.css';
//import fullserver from './projects.js'
import logo from './images/cat.png'
import DatePicker from 'react-datepicker';
import "./stylesheets/datepicker/datepicker.css";
import axios from 'axios'

let fromserver = []

const productionTeams = [
    { name: 'Vincent Watkins', alias: 'Manager 1', 
     engineers: [
       { name: 'Vincent Watkins', alias: 'Manager 1'}, 
       { name: 'Bobby Zhang', alias: 'Engineer 1'}, 
       { name: 'Jeremy Deremer', alias: 'Engineer 2'}, 
       { name: 'Angelo Lewis', alias: 'Engineer 3'}, 
       { name: 'Tyler Harvey', alias: 'Engineer 4'}, 
       { name: 'Blake Bennett', alias: 'Engineer 5'}
       ]
  }, { name: 'Sreekanth Bandaru', alias: 'Manager 2',
      engineers: [
        { name: 'Sreekanth Bandaru', alias: 'Manager 2'},
        { name: 'Phil Limoge', alias: 'Engineer 6'},
        { name: 'Matt Andrews', alias: 'Engineer 7'},
        { name: 'Juan Sanchez', alias: 'Engineer 8'},
        { name: 'Peter Baugh', alias: 'Engineer 9'},
        { name: 'Stanislav Plagov', alias: 'Engineer 10'},
        { name: 'Erik Walker', alias: 'Engineer 11'}
      ]}
  ]                   

const dateOut = (fullDate = new Date()) => {
  //console.log(fullDate)
  return fullDate.toISOString().split('T')[0]
}

class AddComment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
      };
    }
    
    render() {
      return (
        <div className='body-comment-add'>
          <div className='add-space'>Add...</div>
          <input id={this.props.projectnum + '_addcomment'} className='add-text'/>
          <div className='add-button' onClick={this.props.onClick}><i className="fas fa-plus"></i></div>
        </div>
      )
    }
  }

class ProjectComments extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        update: false
      };
    }
   
    render() {
      let comments = this.props.comments.map ((comment) => {
        return (
          <div key={this.props.projectnum + '_' + comment._id + '_bc'} className='body-comment'> 
            <div className='body-comment-date'>{dateOut(new Date(comment.createddate))}</div>
            <input id={this.props.projectnum + '_' + comment._id + '_bct'} className='body-comment-text' defaultValue={comment.text} />
            <div className='body-comment-save'>
              <i id={this.props.projectnum + '_' + comment._id + '_bcs' } onClick={this.props.saveComment} className="fas fa-save"></i>
            </div>
            <div className='body-comment-delete'><i id={this.props.projectnum + '_' + comment._id + '_bcd' } onClick={this.props.deleteComment} className="far fa-trash-alt"></i></div>
          </div>
        )
      })
      comments.sort((a, b) => a.createddate - b.createddate)
      return (
        <div className='body-comments'>
          <AddComment projectnum={this.props.projectnum} onClick={this.props.newComment} />
          {comments}
        </div>
      )
    }
  }
class ProjectTasks extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        startDate: new Date(),
        endDate: new Date()
      };
      this.handleStartDateChange = this.handleStartDateChange.bind(this)
      this.handleEndDateChange = this.handleEndDateChange.bind(this)
    }
    handleStartDateChange(date) {
      this.setState({
        startDate: date
      })
    }
    handleEndDateChange(date) {
      this.setState({
        endDate: date
      })
    } 
    
    render() {
      let tasks = this.props.tasks
      tasks.sort((a, b) =>  parseInt(a.enddate.replace (/-/g, "")) - parseInt(b.enddate.replace (/-/g, "")))
      tasks = this.props.tasks.map ((task) => {
        //let completeIcon = (task.complete) ? (<i className="far fa-check-square"></i>) : (<i className="far fa-square"></i>)
        return (
          <div key={this.props.projectnum + '_' + task._id + '_BT'} className='body-task'> 
            <div className='body-task-detail'>
              <input id={this.props.projectnum + '_' + task._id + '_DESC'} className='task-col1 body-task-input' defaultValue={ task.description } />
              <input id={this.props.projectnum + '_' + task._id + '_SD'} className='task-col2 body-task-input' defaultValue={ dateOut(new Date(task.startdate)) } />           
              <input id={this.props.projectnum + '_' + task._id + '_ED'} className='task-col3 body-task-input' defaultValue={ dateOut(new Date(task.enddate)) } /> 
              <input id={this.props.projectnum + '_' + task._id + '_PC'} className='task-col4 body-task-input' defaultValue={ task.percentcomplete + '%'} /> 
              <input id={this.props.projectnum + '_' + task._id + '_BH'} className='task-col5 body-task-input' defaultValue={ task.budgethours } /> 
              <input id={this.props.projectnum + '_' + task._id + '_AH'} className='task-col6 body-task-input' defaultValue={ task.actualhours } /> 
              <div className='task-col7'> { Math.round((task.actualhours / task.budgethours) * 100 ).toString() + '%' } </div>
              <input type='checkbox' id={this.props.projectnum + '_' + task._id + '_COMP'} className='task-col8' defaultChecked={task.complete}  />
              <div className='body-task-save task-col9'><i id={this.props.projectnum + '_' + task._id + '_SAVE'} onClick={this.props.saveTask} className="fas fa-save"></i></div>
              <div className='body-task-delete task-col10' ><i id={this.props.projectnum + '_' + task._id + '_DELETE'} onClick={this.props.deleteTask} className="far fa-trash-alt"></i></div>
            </div>
          </div>

        )
      })

      return (
        <div className='body-tasks'>
          <div className='body-task-label'>
            <div className='task-col1'>Description</div>
            <div className='task-col2'>Start</div>
            <div className='task-col3'>End</div>
            <div className='task-col4'>Comp %</div>
            <div className='task-col5'>Budget</div>
            <div className='task-col6'>Actual</div>
            <div className='task-col7'>% Used</div>
          </div>
          {tasks}
          <div className='body-task-add'>
            <input id={this.props.projectnum + '_addtaskdescription'} className='new task-add-input task-col1' />
            <DatePicker id={this.props.projectnum + '_addstartdate'} className='new task-add-input task-col2' selected={ this.state.startDate } onChange={ this.handleStartDateChange } name="startDate" dateFormat="yyyy-MM-dd" />
            <DatePicker id={this.props.projectnum + '_addenddate'} className='new task-add-input task-col3' selected={ this.state.endDate } onChange={ this.handleEndDateChange } name="endDate" dateFormat="yyyy-MM-dd" />
            <div className='task-col4'> 0%</div>
            <input id={this.props.projectnum + '_addbudgethours'} className='new task-add-input task-col5' />
            <div className='task-col6'>0</div>
            <div className='task-col7'>0%</div>
            <input type='checkbox' id={this.props.projectnum + '_addcomplete'} className='task-col8' defaultChecked={false} />
            <div key={this.props.projectnum + '_taskadd'} id={this.props.projectnum + '_taskadd'} onClick={this.props.newTask} className='body-task-save task-col9'><i className="fas fa-plus"></i></div>            
          </div>
        </div>
      )
    }
  }

const buildDetails = (proj, edit, saveProjectDetails, deleteProject, saveTask, newTask, deleteTask, newComment, saveComment, deleteComment) => {
    let currentStatus = proj.status
    let dropdownClass = (edit) ? 'body-detail-dropdown-edit' : 'body-detail-dropdown'
    let inputClass = (edit) ? 'body-detail-input-edit' : 'body-input-dropdown'
    return (
      <div className='project-body'>
        <div className='body-details'>
          <div id={proj.projectnum + 'LPNUM'} className='body-detail-label'>{'Number: '}</div>
          <input id={proj.projectnum + 'PNUM'} className={inputClass} defaultValue={proj.projectnum}></input>

          <div id={proj.projectnum + 'LPNAME'} className='body-detail-label'>{'Name: '}</div>
          <input id={proj.projectnum + 'PNAME'} className={inputClass} defaultValue={proj.projectname}></input>

          <div id={proj.projectnum + 'LSTATUS'} className='body-detail-label'>{'Status: '}</div>
          <select id={proj.projectnum + 'STATUS'} className={dropdownClass} defaultValue={currentStatus}>
            <option value="Submittal">Submittal</option>
            <option value="Production">Production</option>
            <option value="Testing">Testing</option>
            <option value="Startup">Startup</option>
          </select>

          <div id={proj.projectnum + 'LPE'} className='body-detail-label'>{'Proj Eng: '}</div>
          <select id={proj.projectnum + 'PE'} className={dropdownClass} defaultValue={proj.projectengineer}>
            <option value='Vincent Watkins'>Manager 1</option> 
            <option value='Bobby Zhang'>Engineer 1</option> 
            <option value='Jeremy Deremer'>Engineer 2</option> 
            <option value='Angelo Lewis'>Engineer 3</option> 
            <option value='Tyler Harvey'>Engineer 4</option> 
            <option value='Blake Bennett'>Engineer 5</option>
            <option value='Sreekanth Bandaru'>Manager 2</option>
            <option value='Phil Limoge'>Engineer 6</option>
            <option value='Matt Andrews'>Engineer 7</option>
            <option value='Juan Sanchez'>Engineer 8</option>
            <option value='Peter Baugh'>Engineer 9</option>
            <option value='Stanislav Plagov'>Engineer 10</option>
            <option value='Erik Walker'>Engineer 11</option>
          </select>

          <div id={proj.projectnum + 'LEM'} className='body-detail-label'>{'Eng Man: '}</div>
          <select id={proj.projectnum + 'EM'} className={dropdownClass} defaultValue={proj.engineeringmanager}>
            <option value='Vincent Watkins'>Manager 1</option> 
            <option value='Sreekanth Bandaru'>Manager 2</option>
          </select>

          <div id={proj.projectnum + 'LAE'} className='body-detail-label'>{'App Eng: '}</div>
          <select id={proj.projectnum + 'AE'} className={dropdownClass} defaultValue={proj.applicationsengineer}>
            <option value='Stephen Judkins'>Apps Engineer 1</option>
            <option value='Jason Metz'>Apps Engineer 2'</option>
            <option value='James Hilton'>Apps Engineer 3</option>
            <option value='Irina Kolesova'>Apps Engineer 4</option>
            <option value='Roy Baker'>Apps Engineer 5</option>
            <option value='Paul Clark'>Apps Engineer 6</option>
          </select>

          <div id={proj.projectnum + 'LPM'} className='body-detail-label'>{'Proj Man: '}</div>
          <select id={proj.projectnum + 'PM'} className={dropdownClass} defaultValue={proj.projectmanager}>
            <option value='Woody McClendon'>PM 1</option>          
            <option value='Rehab Ahmed'>PM 2</option> 
            <option value='Leroy Suneus'>PM 3</option> 
            <option value='Luis Garcia'>PM 4</option> 
            <option value='Emily Diamond'>PM 5</option> 
            <option value='Ralph Hunter'>PM 6</option> 
            <option value='Adis Sabitovic'>PM 7</option> 
            <option value='Steve Lichniak'>PM 8</option> 
            <option value='Mitch Lusk'>PM 9</option> 
            <option value='Gerry ISE Berg'>PM 10</option> 
          </select>

          <div id={proj.projectnum + 'LCAT'} className='body-detail-label'>{'Dealer: '}</div>
          <input id={proj.projectnum + 'CAT'} className={inputClass} defaultValue={proj.dealer}></input>

          <div id={proj.projectnum + 'LAPP'} className='body-detail-label'>{'Application: '}</div>
          <select id={proj.projectnum + 'APP'} className={dropdownClass} defaultValue={proj.applicationtype}>
            <option value='EGP'>EGP</option> 
            <option value='XLM'>XLM</option> 
            <option value='XLM-T'>XLM-T</option> 
            <option value='MTM'>MTM</option> 
            <option value='MTGTM'>MTGTM</option> 
            <option value='U'>U Config</option> 
          </select>

          <div id={proj.projectnum + 'LPLC'} className='body-detail-label'>{'PLC: '}</div>
          <select id={proj.projectnum + 'PLC'} className={dropdownClass} defaultValue={proj.plcplatform}>
            <option value='M1E'>M1E</option> 
            <option value='M340'>M340</option> 
            <option value='M580'>M580</option> 
            <option value='AB'>Allen Bradley</option> 
            <option value='Other'>Other</option> 
          </select>

          <div id={proj.projectnum + 'LGENQTY'} className='body-detail-label'>{'Gens: '}</div>
          <input id={proj.projectnum + 'GENQTY'} className={inputClass} defaultValue={proj.generatorquantity}></input>

          <div id={proj.projectnum + 'LEMCP'} className='body-detail-label'>{'EMCP: '}</div>
          <select id={proj.projectnum + 'EMCP'} className={dropdownClass} defaultValue={proj.emcp}>
            <option value='4.2'>v4.2</option> 
            <option value='4.3'>v4.3</option> 
            <option value='4.4'>v4.4</option> 
          </select>
          
          <div id={proj.projectnum + 'LCHP'} className='body-detail-label'>{'CHP: '}</div>
          <select id={proj.projectnum + 'CHP'} className={dropdownClass} defaultValue={proj.chp.toString()}>
            <option value='false'>No</option> 
            <option value='true'>Yes</option> 
          </select>

          <div id={proj.projectnum + 'LVOLT'} className='body-detail-label'>{'VOLT: '}</div>
          <input id={proj.projectnum + 'VOLT'} className={inputClass} defaultValue={proj.volt}></input>

          <div id={proj.projectnum + 'LFREQ'} className='body-detail-label'>{'FREQ: '}</div>
          <input id={proj.projectnum + 'FREQ'} className={inputClass} defaultValue={proj.frequency}></input>

          {/* Correct Bus Types Below */}
          <div id={proj.projectnum + 'LBUS'} className='body-detail-label'>{'BUS: '}</div>
          <select id={proj.projectnum + 'BUS'} className={dropdownClass} defaultValue={proj.bustype}>
            <option value='Type A'>Type A</option> 
            <option value='Type B'>Type B</option>         
          </select>

          <div id={proj.projectnum + 'LMFG'} className='body-detail-label'>{'MFG: '}</div>
          <input id={proj.projectnum + 'MFG'} className={inputClass} defaultValue={proj.powerenvelopemanufacturer}></input>

          <div id={proj.projectnum + 'LCOMP'} className='body-detail-label'>{'Complexity: '}</div>
          <select id={proj.projectnum + 'COMP'} className={dropdownClass} defaultValue={proj.technicalcomplexity}>
            <option value='1'>Level 1</option> 
            <option value='2'>Level 2</option> 
            <option value='3'>Level 3</option> 
            <option value='4'>Level 4</option> 
          </select>
          <div className='body-detail-delete'><i id={proj.projectnum + '_DELETE'} onClick={deleteProject} className="far fa-trash-alt"></i></div>
          <div className='body-detail-save'><i onClick={saveProjectDetails} className="fas fa-save"></i></div>
        </div>
        <ProjectTasks projectnum={proj.projectnum} tasks={proj.tasks} newTask={newTask} saveTask={saveTask} deleteTask={deleteTask}/>
        <ProjectComments projectnum={proj.projectnum} comments={proj.comments} newComment={newComment} saveComment={saveComment} deleteComment={deleteComment}/>
      </div>
    )
  } 
class ProjectDetail extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        expanded: false
      }
      this.toggleExpanded = this.toggleExpanded.bind(this); 
      this.saveProjectDetails = this.saveProjectDetails.bind(this); 
      this.deleteProject = this.deleteProject.bind(this); 
      this.saveTask = this.saveTask.bind(this); 
      this.newTask = this.newTask.bind(this); 
      this.deleteTask = this.deleteTask.bind(this); 
      this.newComment = this.newComment.bind(this); 
      this.saveComment = this.saveComment.bind(this); 
      this.deleteComment = this.deleteComment.bind(this); 
    }
    toggleExpanded() {
      this.setState({expanded: !this.state.expanded})
    }
    saveProjectDetails() {
      //get entered values
      let newValues = {
        projectnum: document.getElementById(this.props.proj.projectnum + 'PNUM').value, 
        projectname: document.getElementById(this.props.proj.projectnum + 'PNAME').value, 
        projectengineer: document.getElementById(this.props.proj.projectnum + 'PE').value, 
        engineeringmanager: document.getElementById(this.props.proj.projectnum + 'EM').value,
        applicationsengineer: document.getElementById(this.props.proj.projectnum + 'AE').value, 
        projectmanager: document.getElementById(this.props.proj.projectnum + 'PM').value, 
        dealer: document.getElementById(this.props.proj.projectnum + 'CAT').value, 
        status: document.getElementById(this.props.proj.projectnum + 'STATUS').value,
        applicationtype: document.getElementById(this.props.proj.projectnum + 'APP').value,
        plcplatform: document.getElementById(this.props.proj.projectnum + 'PLC').value,
        generatorquantity: document.getElementById(this.props.proj.projectnum + 'GENQTY').value,
        emcp: document.getElementById(this.props.proj.projectnum + 'EMCP').value,
        chp: document.getElementById(this.props.proj.projectnum + 'CHP').value,
        volt: document.getElementById(this.props.proj.projectnum + 'VOLT').value,
        frequency: document.getElementById(this.props.proj.projectnum + 'FREQ').value,
        bustype: document.getElementById(this.props.proj.projectnum + 'BUS').value,
        powerenvelopemanufacturer: document.getElementById(this.props.proj.projectnum + 'MFG').value,
        technicalcomplexity: document.getElementById(this.props.proj.projectnum + 'COMP').value
      }
      //replace values in this.props.proj
      let nvKeys = Object.keys(newValues)
      for (let i = 0; i < nvKeys.length; i++) {
        let thisKey = nvKeys[i]
        this.props.proj[thisKey] = newValues[thisKey]
      }
      //update ProjectDetails put
      axios
        .put('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/details', newValues)
        .then(res => {
          console.log(res.data)
        })
        .catch(error => {
          console.error(error)
        })
      this.props.updateProjects()
    }
    deleteProject() {
      //confirm delete
      var result = window.confirm("Confirm deleting this Project?");
      if (result) {
        //Logic to delete the item remove from fromserver
        for (let i = 0; i < fromserver.length; i++) {
          console.log(i, 'fs', fromserver[i].projectnum, 'pn', this.props.proj.projectnum, 'fs === pn',fromserver[i].projectnum === this.props.proj.projectnum)
          if (fromserver[i].projectnum === this.props.proj.projectnum) {
            console.log(i)
            fromserver = [].concat(fromserver.slice(0, i), fromserver.slice(i+1, fromserver.length))
            i = fromserver.length + 1
          }
        }
        //remove Project from database
        axios
          .delete('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/details')
          .then(res => {
            console.log(res.data)
          })
          .catch(error => {
            console.error(error)
          })        
        this.props.updateProjects()
      }
    }
    saveTask(event) {
      //get data
      let taskId = event.target.id.split('_')[1]
      let sDate = new Date(document.getElementById(this.props.proj.projectnum + '_' + taskId + '_SD').value)
      let sDateStr = sDate.toISOString().split('T')[0]
      let eDate = new Date(document.getElementById(this.props.proj.projectnum + '_' + taskId + '_ED').value)
      let eDateStr = eDate.toISOString().split('T')[0]
      let cDate = new Date()
      let cDateStr = cDate.toISOString().split('T')[0]
      let updateTask = {
        _id: taskId,
        description: document.getElementById(this.props.proj.projectnum + '_' + taskId + '_DESC').value,
        startdate: sDateStr,
        enddate: eDateStr,
        percentcomplete: document.getElementById(this.props.proj.projectnum + '_' + taskId + '_PC').value.replace(/%/g, ''),
        budgethours: document.getElementById(this.props.proj.projectnum + '_' + taskId + '_BH').value,
        actualhours: document.getElementById(this.props.proj.projectnum + '_' + taskId + '_AH').value,
        createddate: cDateStr,
        complete: document.getElementById(this.props.proj.projectnum + '_' + taskId + '_COMP').checked,
        replaced: false
      }
      
      //save data local
      for (let t = 0; t < this.props.proj.tasks.length; t++) {
        if (taskId === this.props.proj.tasks[t]['_id']) {
          let nvKeys = Object.keys(updateTask)
          for (let i = 0; i < nvKeys.length; i++) {
            let thisKey = nvKeys[i]
            this.props.proj.tasks[t][thisKey] = updateTask[thisKey]
          }
          t = this.props.proj.tasks.length
        }
      }
      //saveTask put
      console.log('saveTask', updateTask)
      axios
        .put('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/task', updateTask)
        .then(res => {
          console.log(res.data)
        })
        .catch(error => {
          console.error(error)
        })
      this.props.updateProjects()
    }
    newTask() {
      //get data
      let sDate = new Date(document.getElementById(this.props.proj.projectnum + '_addstartdate').value)
      let sDateStr = sDate.toISOString().split('T')[0]
      let eDate = new Date(document.getElementById(this.props.proj.projectnum + '_addenddate').value)
      let eDateStr = eDate.toISOString().split('T')[0]
      let cDate = new Date()
      let cDateStr = cDate.toISOString().split('T')[0]
      let newTask = {
        description: document.getElementById(this.props.proj.projectnum + '_addtaskdescription').value,
        startdate: sDateStr,
        enddate: eDateStr,
        percentcomplete: 0,
        budgethours: document.getElementById(this.props.proj.projectnum + '_addbudgethours').value,
        actualhours: 0,
        createddate: cDateStr,
        complete: document.getElementById(this.props.proj.projectnum + '_addcomplete').checked,
        replaced: false
      }
      console.log('newTask', newTask)
      //newTask put
      axios
        .post('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/task', newTask)
        .then(res => {
          console.log('this.props.proj.tasks', this.props.proj.tasks)
          console.log('res.data', res.data)
          this.props.proj.tasks = res.data
          this.props.updateProjects()
        })
        .catch(error => {
          console.error(error)
        })
    }
    deleteTask(event) {
      //confirm delete
      let taskId = event.target.id.split('_')[1]
      var result = window.confirm("Confirm deleting this Task?");
      if (result) {
        //remove from database
        axios
          .delete('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/task', { data: {taskId: taskId} })
          .then(res => {
            console.log(res.data)
            //Logic to delete the item remove from fromserver
            for (let i = 0; i < fromserver.length; i++) {
              if (fromserver[i].projectnum === this.props.proj.projectnum) {
                fromserver[i].tasks = res.data
                this.props.updateProjects()
              }
            }
          })
          .catch(error => {
            console.error(error)
          }) 
      }
      this.props.updateProjects()
    }
    newComment() {
      //get data
      let cDate = new Date()
      let cDateStr = cDate.toISOString().split('T')[0]
      let newComment = {
        text: document.getElementById(this.props.proj.projectnum + '_addcomment').value,
        createddate: cDateStr
      }
      console.log(newComment)
      //newComment push
      axios
        .post('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/comment', newComment)
        .then(res => {
          this.props.proj.comments = res.data
          this.props.updateProjects()
        })
        .catch(error => {
          console.error(error)
        })
    }
    saveComment(event) {
      //get data
      let commentId = event.target.id.split('_')[1]
      let updateComment = { _id: commentId,
        text: document.getElementById(this.props.proj.projectnum + '_' + commentId + '_bct').value }
      //save data
      for (let t = 0; t < this.props.proj.comments.length; t++) {
        if (commentId === this.props.proj.comments[t]._id) {
          this.props.proj.comments[t].text = updateComment.text
          t = this.props.proj.comments.length
        }
      }      
      axios
        .put('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/comment', updateComment)
        .then(res => {
          console.log(res.data)
        })
        .catch(error => {
          console.error(error)
        })
      this.props.updateProjects()
    }
    deleteComment(event) {
      //confirm delete
      console.log(event)
      let commentId = event.target.id.split('_')[1]
      console.log(commentId)
      var result = window.confirm("Confirm deleting this Coment?");
      if (result) {
        //remove from database
        axios
          .delete('https://catnode.tylerfharvey.repl.co/api/' + this.props.proj.projectnum + '/comment', { data: {commentId: commentId} })
          .then(res => {
            console.log(res.data)
            //Logic to delete the item remove from fromserver
            for (let i = 0; i < fromserver.length; i++) {
              if (fromserver[i].projectnum === this.props.proj.projectnum) {
                fromserver[i].comments = res.data        
                this.props.updateProjects()
              }
            }
          })
          .catch(error => {
            console.error(error)
          }) 
      }
      this.props.updateProjects()
    }
    render() {
      let details = []
      //let tasks = []
      //let comments = []
      if (this.state.expanded) {
        //true will allow for edits. in the future change this value
        details = buildDetails(this.props.proj, true, this.saveProjectDetails, this.deleteProject, this.saveTask, this.newTask, this.deleteTask, this.newComment, this.saveComment, this.deleteComment)
      }
      let thisProject = this.props.proj
      let classEx = (this.state.expanded) ? 'fas fa-compress-alt' : 'fas fa-expand-alt'
      let chpText = (thisProject.chp) ? ' with CHP' : ''
      let projectDescription = `C${thisProject.technicalcomplexity} ${thisProject.powerenvelopemanufacturer} ${thisProject.plcplatform} ${thisProject.applicationtype} with (${thisProject.generatorquantity}) ${thisProject.emcp} ${thisProject.volt} VAC ${thisProject.frequency} Hz Gens${chpText} and ${thisProject.bustype} Bus`
      return (
        <div className='project-container'>
          <div className='project-header' onClick={this.toggleExpanded}>
            <div className='project-header-text project-col1'>{thisProject.projectnum}</div>
            <div className='project-header-text project-col2'>{thisProject.projectname}</div>
            <div className='project-header-text project-col3'>{'***'}</div>
            <div className='project-header-text project-col4'>{projectDescription}</div>
            <div className='project-header-text project-col5'>{thisProject.status}</div>            
            <div className='project-header-text project-col6'><i className={classEx}></i></div>
            {/*<div className='project-header-text project-col6' onClick={console.log('external')}><i className="fas fa-external-link-alt"></i></div>*/}
          </div> 
            {details}
        </div>
      );
    }
  };
const filterSortProject = (projs, sel) => {
    //filter
    let filteredProjects = []
    switch (sel[0]) {
      //a is for all
      case 'a':
        filteredProjects = projs
        break;
      //m is for manager
      case 'm':
        let managerName = sel.slice(1).replace(/([A-Z])/g, ' $1').trim()
        filteredProjects = projs.filter((proj) => { return managerName === proj.engineeringmanager })
        break;
      //e is for engineer
      case 'e':
        let engineerName = sel.slice(1).replace(/([A-Z])/g, ' $1').trim()
        filteredProjects = projs.filter((proj) => engineerName === proj.projectengineer)
        break;
      default:
    }  
    //sort
    return filteredProjects
  }
class DispProjects extends React.Component {
    constructor(props) {
      super(props)
      this.state ={
        update: false
      }
      this.updateProjects = this.updateProjects.bind(this)
    }

    updateProjects(){
      this.setState({update: !this.state.update})
    }

    render() {
      //get appropriate Projects to display and sort
      //sort by status, shipdate
      let projects = filterSortProject(fromserver, this.props.selected)
      let projOut = projects.map((proj) => {
        return (
          <ProjectDetail key={proj.projectnum} proj={proj} updateProjects={this.updateProjects} />
          )
      })
      return (
        <div className='projects-container'>
            <div id='project-labels' className='project-label-container'>
                <div id='project-labels-number' className='project-label project-col1'>Number</div>
                <div id='project-labels-name' className='project-label project-col2'>Name</div>
                <div id='project-labels-engineer' className='project-label project-col3'>Engineer</div>
                <div id='project-labels-tech' className='project-label project-col4'>Details</div>
                <div id='project-labels-status' className='project-label project-col5'>Status</div>
            </div>
          {projOut}
        </div>
      );
    }
  };
class Engineer extends React.Component {
    constructor(props) {
      super(props)
      let eId = 'e' + this.props.engineer.name.replace(/\s/g, '')
      this.state = {
        id: eId
      }
    }
    
    render() {
      let classN = (this.props.selected === this.state.id) ? 'engineer selected' : 'engineer not-selected'
      return (
        <div className='engineer-container'>
          <div key={this.state.id} id={this.state.id} className={classN} onClick={this.props.onClick}>
            {this.props.engineer.alias}
          </div>
        </div>
      )
    }
  }
class Manager extends React.Component {
    constructor(props) {
      super(props)
      let mId = 'm' + this.props.manager.name.replace(/\s/g, '')
      this.state = {
        expanded: true,
        id: mId
      }
      this.toggleExpanded = this.toggleExpanded.bind(this); 
    }
    toggleExpanded(event) {
      this.setState({expanded: !this.state.expanded})
    }
    
    render() {
      let engs = undefined
      if (this.state.expanded) {
        engs = this.props.manager.engineers.map((engineer) => {
          return(
            <Engineer key={engineer.alias} engineer={engineer} selected={this.props.selected} onClick={this.props.onClick}/>
          )
        })
      }
      let classN = (this.props.selected === this.state.id) ? 'selected' : 'not-selected'
      let classEx = (this.state.expanded) ? 'fas fa-compress-alt' : 'fas fa-expand-alt'
      return (
        <>
          <div className={classN + ' manager-container'}>
            <div id={this.state.id} className='manager' onDoubleClick={this.toggleExpanded} onClick={this.props.onClick}>
              Team {this.props.manager.alias.split(' ')[1]}
            </div>
            <div className='man' onClick={this.toggleExpanded}><i className={classEx}></i></div>
          </div>
          {engs}
        </>
      )
    }
  }
class AllProjects extends React.Component {
    constructor(props) {
      super(props)
      this.state = {
        id: 'all'
      }
      this.createNew = this.createNew.bind(this); 
    }
    createNew() {
      //new Project post
      axios
        .post('https://catnode.tylerfharvey.repl.co/api/addproject')
        .then(res => {
          console.log('res.data', res.data)
          fromserver.unshift(res.data)
          this.props.update()
        })
        .catch(error => {
          console.error(error)
        })

    }
    
    render() {
      let classN = (this.props.selected === this.state.id) ? 'all selected' : 'all not-selected'
      return (
        <div className='all_container'>
          <div className= 'all' onClick={this.createNew}><i className="fas fa-plus"/> New Project</div>
          <div id={this.state.id} className={classN} onClick={this.props.onClick}>
            All Projects
          </div>
        </div>
      );
    }
  };
class EngMenu extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        selected: 'all',
        update: true,
      };
      this.setSelect = this.setSelect.bind(this); 
      this.toggleUpdate = this.toggleUpdate.bind(this); 
    }
    setSelect(event) {
      this.setState({selected: event.target.id});
    } 
    toggleUpdate() {
      this.setState({update: !this.state.update})
    }    
    render() {
      let engList = productionTeams.map((manager) => {
        return (
          <Manager key={manager.alias} manager={manager} selected={this.state.selected} onClick={this.setSelect} />
        )
      })
      fromserver.sort( (a, b) => b.projectnum - a.projectnum)
      return (
        <>
        <div id='catisoheader'>
          <img className='logo' src={logo} alt='Logo'/> Production Projects
        </div>
        <div id='catisoleftmenu'>
          <div id='catisoengineers'>
            <AllProjects selected={this.state.selected} onClick={this.setSelect} update={this.toggleUpdate} />
            {engList}
          </div>
        </div>
        <DispProjects selected={this.state.selected} />
        <div id='catisofooter'></div>
        </>
      );
    }
  };

//get data and load screen
const req = new XMLHttpRequest();
req.open("GET",'https://catnode.tylerfharvey.repl.co/api/all',true);
req.send();
req.onload = function(){
  //process data start
  let fullserver = JSON.parse(req.responseText);
  fromserver = fullserver.filter( project => !(['NaN','Emily Diamond', 'John Shores', 'Huy Mai', 'Alice Buiac', 'Thomas Schwartz', 'Abad Gonzalez', 'Charles Chauvin'].includes(project.projectengineer)) )
  ReactDOM.render(<EngMenu />, document.getElementById('catisoproduction'))
}
