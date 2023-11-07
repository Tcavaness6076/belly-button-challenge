const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
let data;
function init() {
    d3.json(url).then((jsonDatadata) => {
        data = jsonDatadata;
        console.log(data);
        let dropdown = d3.select("#selDataset");
        data.names.forEach((name) => {
            dropdown.append("option").text(name).property("value", name);
        });
        let firstSample = data.names[0];
        buildPlots(firstSample);
        buildBubbleChart(firstSample);
        displaySampleMetadata(firstSample);
        buildGaugeChart(firstSample);
    });
}

function buildPlots(sample) {
        var selectedSample = data.samples.filter((s) => s.id === sample)[0];
        selectedSample.sample_values.sort((a, b) => b - a);
        var top10SampleValues = selectedSample.sample_values.slice(0, 10).reverse();
        var top10OTUIds = selectedSample.otu_ids.slice(0, 10).reverse();
        var top10OTULabels = selectedSample.otu_labels.slice(0, 10).reverse();
        var trace = {
            x: top10SampleValues,
            y: top10OTUIds.map((id) => `OTU ${id}`),
            text: top10OTULabels,
            type: "bar",
            orientation: "h"
        };

        var plotData = [trace];

        var layout = {
            title: `Top 10 OTUs for Sample ${sample}`,
            xaxis: { title: "Sample Values" },
            yaxis: { title: "OTU IDs" }
        };

        Plotly.newPlot("bar", plotData, layout);
}

function buildBubbleChart(sample) {
        var selectedSample = data.samples.filter((s) => s.id === sample)[0];
        var otuIds = selectedSample.otu_ids;
        var sampleValues = selectedSample.sample_values;
        var otuLabels = selectedSample.otu_labels;
        var trace = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds,
                colorscale: 'Earth'
            }
        };
        var plotData = [trace];
        var layout = {
            title: `Bubble Chart for Sample ${sample}`,
            xaxis: { title: "OTU IDs" },
            yaxis: { title: "Sample Values" }
        };
        Plotly.newPlot("bubble", plotData, layout);
}

function displaySampleMetadata(sample) {
        var metadata = data.metadata.filter((m) => m.id == sample)[0];
        var metadataPanel = d3.select("#sample-metadata");
        metadataPanel.html("");
        Object.entries(metadata).forEach(([key, value]) => {
            metadataPanel.append("p").text(`${key}: ${value}`);
        });
}

function buildGaugeChart(sample) {
        var selectedMetadata = data.metadata.filter((m) => m.id == sample)[0];
        var wfreq = selectedMetadata.wfreq;
        var plotData = [
            {
                domain: { x: [0, 1], y: [0, 1] },
                value: wfreq,
                title: { text: "Belly Button Washing Frequency" },
                type: "indicator",
                mode: "gauge+number",
                gauge: {
                    axis: { range: [0, 9] },
                    steps: [
                      { range: [0, 1], color: 'LightYellow' },
                      { range: [1, 2], color: 'Khaki' },
                      { range: [2, 3], color: 'Yellow' },
                      { range: [3, 4], color: 'GreenYellow' },
                      { range: [4, 5], color: 'SpringGreen' },
                      { range: [5, 6], color: 'LimeGreen' },
                      { range: [6, 7], color: 'Green' },
                      { range: [7, 8], color: 'DarkGreen' },
                      { range: [8, 9], color: 'DarkSlateGrey' }
                ]}}];
        var layout = {
            width: 400,
            height: 300,
            margin: { t: 0, b: 0 },
        };

        Plotly.newPlot("gauge", plotData, layout);
}

function optionChanged(sample) {
    buildPlots(sample);
    buildBubbleChart(sample);
    displaySampleMetadata(sample);
    buildGaugeChart(sample);
}

init();
