$('select').formSelect();

let savedJobs = JSON.parse(localStorage.getItem("ww:saved-jobs"));
if (! savedJobs) {
    savedJobs = []
}


    const $jobsList = $('#savedJobsList');
    let $savedJob = $jobsList.find('.saved-job');
    $savedJob.remove();

    $.each(savedJobs, function (i, savedJob) {
        $savedJob = $savedJob.clone();
        $savedJob.find('.saved-job-name').text(savedJob.name);
        $savedJob.find('.saved-job-location').text(savedJob.location);
        $savedJob.find('.saved-job-company').text(savedJob.company);
        $savedJob.find('.saved-job-url').attr("href" , savedJob.url);
        $jobsList.append($savedJob);
    });

$(document).ready(function(){
    $('.modal').modal();

    listSavedJobs();
}) 

//add click function to search for job type
    $("#jobSubmit").click(function(event){
        event.preventDefault();
        $("#resultsContainer").empty();

        let  jobs = $( "#jobOptions option:selected" ).text();

        var  queryURL = "https://www.themuse.com/api/public/jobs?category=" + jobs + "&page=0";
        $.ajax({
            url: queryURL, 
            method: "GET"
        }).then(function(response) {
            var jobListing = response.results
            console.log(jobListing);
            for (i = 0; i < 10; i++){

                //create div for job information
                var jobDiv = $(`<div class = 'col s12 jobDetails' id = 'jobListing${i}'>`);
                
                //create h1 and p for information
                var jobCompany = $("<h4 class = 'jobTitle'>");
                jobCompany.text(jobListing[i].company.name);

                var jobLocation = $("<p class = 'jobLocation'>");
                jobLocation.text(jobListing[i].locations[0].name);

                var jobName = $("<p class = 'jobName'>");
                jobName.text(jobListing[i].name);

                var jobRef = $("<a id='jobURL' target ='_blank'>Apply</a>");
                jobRef.attr("href", (jobListing[i].refs.landing_page));

                var $jobSave = $("<a class=\"save\" data-job-id=\"" + i + "\">Save</a>");
                $jobSave.on("click", function () {
                    let jobId = $(this).data('jobId');
                    let jobData =   {
                        name: jobListing[jobId].name,
                        company: jobListing[jobId].company.name,
                        location: jobListing[jobId].locations[0].name,
                        url: jobListing[jobId].refs.landing_page
                    };

                    //Don't save duplicate jobs
                    let dupeFound = false;

                    $.each(savedJobs, function(i, localJob){
                        if (localJob.url === jobData.url) {
                            dupeFound = true;
                            return;
                        }
                    });

                    if (dupeFound === false) {
                        savedJobs.push(jobData);
                        localStorage.setItem("ww:saved-jobs" , JSON.stringify(savedJobs))
                    }
                
                    $(this).addClass('saved-job');
                    $(this).text('Saved');
                });

                //append all that will be created
                jobDiv.append(jobCompany);
                jobDiv.append(jobLocation);
                jobDiv.append(jobName);
                jobDiv.append(jobRef);
                jobDiv.append($jobSave);
                $("#resultsContainer").append(jobDiv);
            }
        })
    })
  
    //add click function to search for weather in a city
$("#citySearch").click(function(event){
    const apiKey = "&appid=39889f788ff3fd3d6d6270348600fc5b";
        event.preventDefault();
        $(".weatherInfo").empty();

        let  cityName = $("#cityName").val();
        var  weatherURL = 'https://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial' + apiKey;
        $.ajax({
            url: weatherURL, 
            method: "GET"
        }).then(function(weatherResponse) {
            console.log(weatherResponse);

                //create div for weather information
                var weatherDiv = $(`<div class = 'col s12 weahterDetails' id = 'weatherDiv'>`);
                
                //create h and p for information
                var cityName = $("<h4 class = cityName>");
                cityName.text(weatherResponse.name);

                var weather = $("<p class = 'weatherDescription'>")
                weather.text("Current Condition " + weatherResponse.weather[0].description);

                var wind = $("<p class = 'wind'>");
                wind.text("Wind Speed:" + weatherResponse.wind.speed + " MPH");

                var humidity = $("<p class = 'humidity'>");
                humidity.text("Humidity: " + weatherResponse.main.humidity + "%");

                var temp = $("<p class = 'temp'>");
                temp.text("Temperature: " + weatherResponse.main.temp + " (F)");

                //append all that will be created
                weatherDiv.append(cityName);
                weatherDiv.append(weather);
                weatherDiv.append(wind);
                weatherDiv.append(humidity);
                weatherDiv.append(temp);
                $(".weatherInfo").append(weatherDiv);
        })
})