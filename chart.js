function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;
    sampleNames.forEach((sample) => {
      selector.append("option").text(sample).property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildBarCharts(firstSample);
    buildBubbleCharts(firstSample);
    buildGaugeCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildBarCharts(newSample);
  buildBubbleCharts(newSample);
  buildGaugeCharts(newSample);
  buildMetadata(newSample);
}

// Demographics Panel
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    //console.log(result);
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });
  });
}

// 1. Create the buildCharts function.
function buildBarCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    console.log("Bar Charts Loading for " + sample);
    // 3. Create a variable that holds the samples array.
    var sampledata = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var sampleArray = sampledata.filter((sampleObj) => sampleObj.id == sample);
    //  5. Create a variable that holds the first sample in the array.
    var firstSample = sampleArray[0];

    // Object.entries(firstSample).forEach(([key, value]) =>
    // {console.log(key + 'value: ' + value); });

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIds = firstSample.otu_ids;
    var sampleLabels = firstSample.otu_labels;
    var sampleValues = firstSample.sample_values;

    var sampleItems = sampleIds.map((id, index) => {
      return {
        sampleId: id,
        sampleLabel: sampleLabels[index],
        sampleValue: sampleValues[index],
      };
    });
    //console.log(sampleItems);
    var sortedSampleByValues = sampleItems
      .slice()
      .sort((a, b) => d3.descending(a.sampleValue, b.sampleValue));
    //console.log(sortedSampleByValues);
    var topTenSample = sortedSampleByValues.slice(0, 10);
    //console.log(topTenSample);

    // x values are the sample_values
    var xticks = d3
      .entries(topTenSample)
      .map(function (d) {
        return d.value.sampleValue;
      })
      .reverse();
    //console.log(xticks);
    var xhovorText = d3.entries(topTenSample).map(function (d) {
      return d.value.sampleLabel;
    });
    //console.log(xhovorText);

    //Y values
    var yticks = d3.entries(topTenSample).map(function (d) {
      return d.value.sampleValue;
    });
    //console.log(yticks);
    //Y display
    var yaxisR = d3
      .entries(topTenSample)
      .map(function (d) {
        return "OTU " + d.value.sampleId;
      })
      .reverse();
    //console.log(yaxisR);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order
    //  so the otu_ids with the most bacteria are last.

    // 8. Create the trace for the bar chart.
    // The y values are the otu_ids in descending order
    // The x values are the sample_values in descending order
    // The hover text is the otu_labels in descending order.

    var barTrace = {
      type: "bar",
      x: xticks,
      y: yaxisR,
      text: xhovorText,
      orientation: "h",
    };
    // 9. Create the layout for the bar chart.
    var barData = [barTrace];
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found",      
      xaxis: {
        title: {
          text: '<b>Bar chart :</b> It is appropriate to visualize <br> how data is distributed across a number of categories.',
          font: {
            family: 'Courier New, monospace',
            size: 12,
            color: '#7f7f7f'
          }
        }
      },
      paper_bgcolor: "lightblue"
    };
    // 10. Use Plotly to plot the data with the layout.
    Plotly.newPlot("bar", barData, barLayout);
  });
}

// Create the buildCharts function.
function buildBubbleCharts(sample) {
  // Use d3.json to load and retrieve the samples.json file
  d3.json("samples.json").then((data) => {
    console.log("Bubble Charts Loading for " + sample);
    var sampledata = data.samples;
    var resultArray = sampledata.filter((sampleObj) => sampleObj.id == sample);
    var result = resultArray[0];
    // Deliverable 1 Step 10. Use Plotly to plot the data with the layout.
    var sampleIds = result.otu_ids;
    var sampleLabels = result.otu_labels;
    var sampleValues = result.sample_values;

    var xticks = sampleIds;
    //console.log(xticks);
    var yticks = sampleValues;
    //console.log(yticks);

    var hovorText = sampleIds.map((id, index) => {
      const hoverTextDisplay =
        "(" + id + ", " + sampleValues[index] + ")  " + sampleLabels[index];
      return hoverTextDisplay;
    });
    //console.log(hovorText);   

    var d3colors = Plotly.d3.scale.category10();
    var bubbleTrace = {
      x: xticks,
      y: yticks,
      text: hovorText,
      mode: "markers",
      marker: {
        hoverinfo: hovorText,
        color: sampleIds,
        opacity: [1, 0.9, 0.8, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],
        size: yticks,
      },
    };

    var bubbleData = [bubbleTrace];

    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",      
      showlegend: false,
      paper_bgcolor: "lightblue",
      height: 600,
      width: 900,
      plot_bgcolor: "rgb(243, 243, 243)",
      xaxis: {
        title: {
          text: '<b>Bubble chart :</b> It is helpful in providing an instant view of the relative popularity of the result.',
          font: {
            family: 'Courier New, monospace',
            size: 12,
            color: '#7f7f7f'
          }
        }
      }     
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
  });
}

// Create the buildChart function.
function buildGaugeCharts(sample) {
  // Use d3.json to load the samples.json file
  d3.json("samples.json").then((data) => {
    console.log("Gauge Charts Loading for " + sample);
    // Create a variable that holds the samples array.
    var sampleData = data.samples.filter((sampleObj) => sampleObj.id == sample);
    // Create a variable that filters the samples for the object with the desired sample number.

    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var metaData = data.metadata.filter((sampleObj) => sampleObj.id == sample);
    // Create a variable that holds the first sample in the array.
    var sampleArray = sampleData[0];
    // 2. Create a variable that holds the first sample in the metadata array.
    var metaDataArray = metaData[0];
    //console.log(sampleArray);
    // Create variables that hold the otu_ids, otu_labels, and sample_values.
    var sampleIds = sampleArray.otu_ids;
    var sampleLabels = sampleArray.otu_labels;
    var sampleValues = sampleArray.sample_values;
    //console.log(sampleValues);
    // 3. Create a variable that holds the washing frequency.
    var freqValues = parseFloat(metaDataArray.wfreq);
    //console.log(freqValues);
    // Create the yticks for the bar chart.
    xticks = freqValues;
    // Use Plotly to plot the bar data and layout.
    //Plotly.newPlot();

    // Use Plotly to plot the bubble data and layout.
    //Plotly.newPlot();

    // 4. Create the trace for the gauge chart.
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: xticks,
        title: {
          text: '<b>Belly Button Washing Freqency</b> <br>  Scrubs per Week <br>',
         },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [null, 10] },
          steps: [
            { range: [0, 2], color: "tomato" },
            { range: [2, 4], color: "orange" },
            { range: [4, 6], color: "yellow" },
            { range: [6, 8], color: "springgreen" },
            { range: [8, 10], color: "green" },
          ]          
        }
      }
    ];

    var gaugeLayout = {       
      width: 450, 
      height: 450, 
      margin: { t: 0, b: 0 }, 
      paper_bgcolor: "lightblue"           
    };

    // 6. Use Plotly to plot the gauge data and layout.
    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
    
  });
}
