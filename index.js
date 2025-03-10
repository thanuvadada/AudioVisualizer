document.getElementById("audio").addEventListener("change", (event) => {
    const file = event.target.files[0];
  
    const reader = new FileReader();
  
    reader.addEventListener("load", (event) => {
      const arrayBuffer = event.target.result;
  
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
  
      audioContext.decodeAudioData(arrayBuffer, (audioBuffer) => {
        visualize(audioBuffer, audioContext);
      });
    });
  
    reader.readAsArrayBuffer(file);
  });
  
  function visualize(audioBuffer, audioContext) {
    const canvas = document.getElementById("canvas");
    const canvasContext = canvas.getContext("2d");
  

    function resizeCanvas() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
  
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 512; 
  
    const frequencyBufferLength = analyser.frequencyBinCount;
    const frequencyData = new Uint8Array(frequencyBufferLength);
  
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(analyser);
    analyser.connect(audioContext.destination);
    source.start();
  
    const barWidth = (canvas.width / frequencyBufferLength) * 2; 
    const barSpacing = 2; 
  
    function draw() {
      requestAnimationFrame(draw);
  
      canvasContext.fillStyle = "rgba(0, 0, 0, 0.1)";
      canvasContext.fillRect(0, 0, canvas.width, canvas.height);
  
      analyser.getByteFrequencyData(frequencyData);
  
      for (let i = 0; i < frequencyBufferLength; i++) {
        const value = frequencyData[i];
        const percent = value / 255;
        const height = canvas.height * percent;
        const offset = canvas.height - height;
  
        
        const hue = percent * 360; // Hue from 0 to 360
        canvasContext.fillStyle = `hsl(${hue}, 70%, 50%)`;
  
      
        canvasContext.fillRect(
          i * (barWidth + barSpacing),
          offset,
          barWidth,
          height
        );
  
      
        canvasContext.fillStyle = `hsla(${hue}, 70%, 50%, 0.3)`;
        canvasContext.fillRect(
          i * (barWidth + barSpacing),
          offset,
          barWidth,
          height + 10
        );
      }
    }
  
    draw();
  }
