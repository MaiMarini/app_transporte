const loadGoogleMapsScript = async (): Promise<void> => {
  if (document.getElementById("google-maps-script")) {
    // Se o script já foi carregado, não carregue novamente
    return;
  }

  try {
    const response = await fetch("http://localhost:8080/api/maps/script");
    const scriptUrl = await response.url;

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.id = "google-maps-script";
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  } catch (error) {
    console.error("Erro ao carregar o script do Google Maps:", error);
    throw new Error("Falha ao carregar o script do Google Maps.");
  }
};

export default loadGoogleMapsScript;
