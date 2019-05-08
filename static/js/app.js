function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(`/metadata/${sample}`).then((sample_metadata) => {
    let metaSample = d3.select("#sample-metadata")
    metaSample.html("")

    Object.entries(sample_metadata).forEach(([key, value]) => {

      metaSample.append('h6').text(`${key}: ${value}`)


    })



  })
     // Use d3 to select the panel with id of `#sample-metadata`
    // Use `.html("") to clear any existing metadata
  
    // Use `Object.entries` to add each key and value pair to the panel
  
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
    
}

function buildCharts(sample) {
  
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids = data.otu_ids
    const otu_labels = data.out_labels
    const sample_values = data.sample_values

    // @TODO: Build a Bubble Chart using the sample data
    let bubbleTrace = [{
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      text: otu_labels,
      marker: {
        size: sample_values,
        color: otu_ids
      }
    }]
    
    
    let bubbleLayout = {
      title: 'Sample Value vs OTU ID',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Sample Values'}
    }
    
    Plotly.newPlot("bubble", bubbleTrace, bubbleLayout )

  })

  // @TODO: Build a Pie Chart
  d3.json(`/samples/${sample}`).then((pieData) => {
    const otu_ids_sliced = pieData.otu_ids.slice(0, 10)
    const otu_labels_sliced = pieData.otu_labels.slice(0, 10)
    const sample_values_sliced = pieData.sample_values.slice(0, 10)

    // @TODO: Build a Bubble Chart using the sample data
    let pieTrace = [{
      values: sample_values_sliced,
      labels: otu_ids_sliced,
      hoverinfo: otu_labels_sliced,
      type: 'pie'
    }]
    
    
    let pieLayout = {
      title: '% of Sample Values',
    }
    
    Plotly.newPlot("pie", pieTrace, pieLayout )

  })
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
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
