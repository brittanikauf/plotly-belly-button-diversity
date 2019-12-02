function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

    d3.json("/metadata/"+ sample).then(function(data) {
      var selector = d3.select("#sample-metadata").html(""); 
      selector.html("");

      for (i = 0; i < 5; i++) {
        selector.append("text").html("font size='1'>"
        + Object.entries(data) [i][0] + ":"
        + Object.entries(data)[i][1] + "</font><br>");
      };

      selector.append("text").html("font size='1'>SAMPLEID: " + Object.entires(data) [6][1] + "</font><br>");
    }); 

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots

d3.json("/samples/"+ sample).then(function(data) {
  var otu_id = data.otu_id; 
  var otu_label = data.otu_label; 
  var sample_value = data.sample_value; 

var trace1 = {
  x: otu_id, 
  y: sample_value, 
  mode: 'markers', 
  marker: {
    size: sample_value, 
    color: otu_id}, 
    text: otu_label
  }; 

  var data1 = [trace1]; 

  var layout = {
    showlegend: false
  }; 

  plotly.newPlot("bubble", data1, layout); 

var sample_data = sample.data.sort(function(a,b) {
  return b.sample_value - a.sample_value; 

}); 

sample_data = sample_data.slice(0, 10); 

var trace2 = {
  labels: sample_data.map(row => row.otu_id), 
  values: sample_data.map(row => row.sample_value), 
  hovertext: sample_data.map(row => row.otu_label), 
  type: "pie"
}; 

var data2 = [trace2]; 

Plotly.newPlot("pie", data2); 

}); 
} 

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
