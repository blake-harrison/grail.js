// config variables, adjust as needed

// colors to use for items
TARGET_COLOR = '#000000' // black
EARLY_COLOR = '#FFD700' // gold
ON_TIME_COLOR = '#7FFF00' // chartreuse
LATE_COLOR = '#FF0000' // red

// prereq date markers - item cannot start until all 3 pass
PREREQ_1 = 'A'
PREREQ_2 = 'B'
PREREQ_3 = 'C'


/* primary entry point - element is id of the parent element (should be empty div) 
//      data is a json list of rows for the table taking the following form:
        data = [
            { 
              rowname: "Row Name", // string holding the row name 
              length: 10, // how many cells are occupied
              target: 0,  
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

    let total_days = 0 // total length the chart needs to be 
    for(var obj in data) { // for each entry in data array
        prereq_key = 0
        target = 0
        length = 0
        for(var key in data[obj]) { // for each key in the json obj
            if(key.match(/prereq.*/)) { // if reading a prereq
                if(data[obj][key]>prereq_key) // if read key is latest (chronologically) prereq
                   prereq_key = data[obj][key]  
            } else if(key=='target') // if reading a target date
                target = data[obj][key]
            else if(key=='length') // if reading length
                length = data[obj][key]
        }
        if((prereq_key + length)>target) { // if last prereq + length is farther out than target
            if((prereq_key + length)>total_days) // if last prereq + length is farther out than current total
                total_days = prereq_key + length // update current total
        } else if(target>total_days) // if target is farther out than current total
            total_days = target // update current total
    } 
    total_days = total_days + 10 // pads end

    // pads whitespace in the header row
    for(let x = 0; x<total_days-1; x++) {
        let th = document.createElement("th");
        let space = document.createTextNode("");
        th.appendChild(space)
        header_row.append(th)
    }    

    // prepares table body
    let gantt_body = gantt_chart.createTBody()

    // iterates through data, finding values and appending to table
    data.forEach(item => {
        // insert new row
        let newrow = gantt_body.insertRow();
        // create 1st column
        let td1 = newrow.insertCell(0);
        let rowname = document.createTextNode(item['rowname']);
        td1.appendChild(rowname)
        td1.style.width = "40px";
        
        // find the start date by comparing prereq dates to find the latest
        let start_date = total_days
        let prereq_dates =[0,0,0]
        if(item['prereq_1'])
            prereq_dates[0] = item['prereq_1']
        if(item['prereq_2'])
            prereq_dates[1] = item['prereq_2']
        if(item['prereq_3'])
            prereq_dates[2] = item['prereq_3']
        start_date = Math.max.apply(Math,prereq_dates);
        // calculate the length of the colored portion
        let end_date = start_date + item['length'] 

        // determine the color (based on target)
        if(end_date>target)
            item_color = LATE_COLOR;
        else if(end_date+3<target)
            item_color = EARLY_COLOR;
        else item_color = ON_TIME_COLOR;

        // generates the row
        day_offset = 1
        let j = 0;
        for(let i = 0; i<total_days-day_offset; i++) {
            let icell = newrow.insertCell(i+1);

            // if i is a prereq date (ignored 0 prereq dates)
            if(prereq_dates.includes(i) && i!=0) {
                text_entry = "";
                // finds which prereq date it is
                switch(prereq_dates.indexOf(i)) {
                    case 0:
                        textentry = PREREQ_1;
                        break;
                    case 1:
                        textentry = PREREQ_2;
                        break;
                    case 2:
                        textentry = PREREQ_3;
                        break; 
                }
                // adds the prereq text to the chart
                let icell_text = document.createTextNode(textentry);
                icell.appendChild(icell_text)
            }

            // if i is within the item time 
            if(start_date<=i && i<=end_date) {
                icell.style.backgroundColor = item_color                
            }
            // if i is the target date
            if(i==item['target'])
                icell.style.backgroundColor = TARGET_COLOR
        
            // adds tooltip to show offset from the start
            icell.title = i;
        }
    })

}