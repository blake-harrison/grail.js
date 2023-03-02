// config variables, adjust as needed

// colors to use for items
TARGET_COLOR = '#000000' // black
EARLY_COLOR = '#FFD700' // gold
ON_TIME_COLOR = '#7FFF00' // chartreuse
LATE_COLOR = '#FF0000' // red

// prereq date markers - item cannot start until all 3 pass
PREREQ_1 = ''
PREREQ_2 = ''
PREREQ_3 = ''


/* primary entry point - element is id of the parent element (should be empty div) 
//      data is a json list of rows for the table taking the following form:
        data = [
            { 
              rowname: "Row Name", // string holding the row name 
              length: 10, // how many cells are occupied 
              prereq_1: 0, // prereq cells start at 0
              prereq_2: 0, 
              prereq_3: 0
            },
            ... and so on
//      ]
*/
function create_gantt(element,data) {
    // pull the container element. chart created as a child to it 
    const gantt_container = document.getElementById(element);
    table_id_string = element + "_table"; // used for the table element

    // creates the table within the html
    chart = document.createElement("table");
    chart.setAttribute("id",table_id_string);
    gantt_container.appendChild(chart);
    
    // finds the newly inserted table
    gantt_chart = document.getElementById(table_id_string);

    // creates table head
    let gantt_head = gantt_chart.createTHead();
    let header_row = gantt_head.insertRow();
    let job_head = document.createElement("th");
    let job_head_title = document.createTextNode("Job");
    job_head.appendChild(job_head_title);
    header_row.appendChild(job_head);

    // adds the blank space to represent days
    const total_days = 122 // THIS NEEDS TO BE DYNAMIC SOMEHOW
    /*
    for(let x = 0; x<total_days; x++) {
        let th = document.createElement("th");
        let space = document.createTextNode("");
        th.appendChild(space)
        header_row.append(th)
    }    
    */
    // iterates through data, finding values and appending to table
    data.forEach(item => {
        // insert new row
        let newrow = gantt_chart.insertRow();
        
        // create 1st r
        let td1 = document.insertCell(0);
        let rowname = document.createTextNode(item['rowname']);
        td1.appendChild(rowname)


    })

}