
import { Mode, AppSection, AppLanguage, AnswerPreference } from './types';

export const DEFAULT_USER_NAME = "User";
export const AI_NAME = "Erynto";
export const CREATOR_NAME = "Omar Alsaharty";

// Placeholder for the custom logo image provided by the user
// In a production environment, this would be a local asset path (e.g., "/logo.png")
export const APP_LOGO_URL = "https://images.unsplash.com/photo-1633409361618-c73427e4e206?w=200&h=200&fit=crop&auto=format";

export const ASPECT_RATIOS = ["1:1", "3:4", "4:3", "9:16", "16:9"];

export const TRANSLATIONS = {
  [AppLanguage.ENGLISH]: {
    home: "Home",
    chat: "Chat",
    speak: "Speak",
    image: "Generate Image",
    video: "Generate Video",
    imageEditor: "Image Editor",
    settings: "Settings & Profile",
    reset: "Reset Session",
    greeting: "Hello",
    selectOption: "Select an activity below.",
    chatDesc: "Standard text conversation.",
    speakDesc: "Voice conversation with live animation.",
    imageDesc: "Create visuals from descriptions.",
    videoDesc: "Still developing.",
    imageEditorDesc: "Upload and edit images with AI.",
    inputPlaceholder: "Message Erynto...",
    listening: "Listening...",
    thinking: "Thinking...",
    speaking: "Speaking...",
    tapToSpeak: "Tap to Speak",
    tapToStop: "Tap to Stop",
    noContent: "No content generated yet.",
    generatedResult: "Generated Result",
    uploaded: "Uploaded",
    theme: "Theme",
    language: "Language",
    answerStyle: "Answer Style",
    username: "Username",
    email: "Email",
    password: "Password",
    aiPersonality: "AI Personality Mode",
    activityStats: "Activity Statistics",
    statMessages: "Messages",
    statImages: "Images",
    statVideos: "Videos",
    statVoice: "Voice",
    modeLight: "Light",
    modeDark: "Dark",
    welcomeMessage: "Welcome to Erynto. Access specific tools via the Home page, or adjust your AI personality in Settings.",
    logout: "Logout",
    createdBy: "Created by",
    voiceSettings: "Voice Settings",
    aiVoice: "AI Voice",
    inputLanguage: "Input Language",
    idleTip: "Tap the microphone to start conversation",
    micError: "Microphone error. Please check permissions.",
    speechError: "Speech recognition is not supported in this browser.",
    generating: "Generating...",
    placeholderImage: "Describe the image you want to create...",
    placeholderVideo: "Describe the video you want to create...",
    download: "Download",
    emptyContent: "Your generated content will appear here.",
    selectStyle: "Select Style",
    styleRealistic: "Realistic",
    styleAnime: "Anime",
    styleCartoon: "Cartoon",
    styleLogo: "Logo",
    styleCinematic: "Cinematic",
    styleMinimal: "Minimal",
    styleFantasy: "Fantasy",
    style3D: "3D Animation",
    aspectRatio: "Aspect Ratio",
    uploadImage: "Upload Source Image",
    dragDrop: "Drag & drop or click to upload",
    describeEdits: "Describe changes (e.g., 'Make it snowy')",
    newChat: "New Chat",
    chatHistory: "Chat History",
    rename: "Rename",
    delete: "Delete",
    untitledChat: "Untitled Chat"
  },
  [AppLanguage.SPANISH]: {
    home: "Inicio",
    chat: "Chat",
    speak: "Hablar",
    image: "Generar Imagen",
    video: "Generar Video",
    imageEditor: "Editor de Imagen",
    settings: "Ajustes y Perfil",
    reset: "Reiniciar Sesión",
    greeting: "Hola",
    selectOption: "Selecciona una actividad abajo.",
    chatDesc: "Conversación de texto estándar.",
    speakDesc: "Conversación de voz con animación.",
    imageDesc: "Crea visuales a partir de descripciones.",
    videoDesc: "Aún en desarrollo.",
    imageEditorDesc: "Sube y edita imágenes con IA.",
    inputPlaceholder: "Mensaje a Erynto...",
    listening: "Escuchando...",
    thinking: "Pensando...",
    speaking: "Hablando...",
    tapToSpeak: "Toca para Hablar",
    tapToStop: "Toca para Parar",
    noContent: "Aún no hay contenido.",
    generatedResult: "Resultado Generado",
    uploaded: "Subido",
    theme: "Tema",
    language: "Idioma",
    answerStyle: "Estilo de Respuesta",
    username: "Nombre de usuario",
    email: "Correo",
    password: "Contraseña",
    aiPersonality: "Modo de Personalidad IA",
    activityStats: "Estadísticas de Actividad",
    statMessages: "Mensajes",
    statImages: "Imágenes",
    statVideos: "Videos",
    statVoice: "Voz",
    modeLight: "Claro",
    modeDark: "Oscuro",
    welcomeMessage: "Bienvenido a Erynto. Accede a herramientas específicas en Inicio o ajusta tu personalidad IA en Ajustes.",
    logout: "Cerrar Sesión",
    createdBy: "Creado por",
    voiceSettings: "Ajustes de Voz",
    aiVoice: "Voz IA",
    inputLanguage: "Idioma de Entrada",
    idleTip: "Toca el micrófono para comenzar la conversación",
    micError: "Error de micrófono. Revisa los permisos.",
    speechError: "Reconocimiento de voz no soportado en este navegador.",
    generating: "Generando...",
    placeholderImage: "Describe la imagen que quieres crear...",
    placeholderVideo: "Describe el video que quieres crear...",
    download: "Descargar",
    emptyContent: "Tu contenido generado aparecerá aquí.",
    selectStyle: "Seleccionar Estilo",
    styleRealistic: "Realista",
    styleAnime: "Anime",
    styleCartoon: "Caricatura",
    styleLogo: "Logotipo",
    styleCinematic: "Cinematográfico",
    styleMinimal: "Minimalista",
    styleFantasy: "Fantasía",
    style3D: "Animación 3D",
    aspectRatio: "Relación de Aspecto",
    uploadImage: "Subir Imagen",
    dragDrop: "Arrastra o clic para subir",
    describeEdits: "Describe cambios (ej. 'Hazlo nevado')",
    newChat: "Nuevo Chat",
    chatHistory: "Historial",
    rename: "Renombrar",
    delete: "Borrar",
    untitledChat: "Chat Sin Título"
  },
  [AppLanguage.FRENCH]: {
    home: "Accueil",
    chat: "Discuter",
    speak: "Parler",
    image: "Générer Image",
    video: "Générer Vidéo",
    imageEditor: "Éditeur d'Image",
    settings: "Paramètres et Profil",
    reset: "Réinitialiser",
    greeting: "Bonjour",
    selectOption: "Sélectionnez une activité ci-dessous.",
    chatDesc: "Conversation textuelle standard.",
    speakDesc: "Conversation vocale avec animation.",
    imageDesc: "Créez des visuels à partir de descriptions.",
    videoDesc: "En développement.",
    imageEditorDesc: "Téléchargez et éditez des images avec l'IA.",
    inputPlaceholder: "Message à Erynto...",
    listening: "Écoute...",
    thinking: "Réfléchit...",
    speaking: "Parle...",
    tapToSpeak: "Appuyez pour Parler",
    tapToStop: "Appuyez pour Arrêter",
    noContent: "Aucun contenu généré.",
    generatedResult: "Résultat Généré",
    uploaded: "Téléchargé",
    theme: "Thème",
    language: "Langue",
    answerStyle: "Style de Réponse",
    username: "Nom d'utilisateur",
    email: "E-mail",
    password: "Mot de passe",
    aiPersonality: "Mode Personnalité IA",
    activityStats: "Statistiques d'Activité",
    statMessages: "Messages",
    statImages: "Images",
    statVideos: "Vidéos",
    statVoice: "Voix",
    modeLight: "Clair",
    modeDark: "Sombre",
    welcomeMessage: "Bienvenue sur Erynto. Accédez aux outils via l'Accueil ou ajustez la personnalité IA dans les Paramètres.",
    logout: "Déconnexion",
    createdBy: "Créé par",
    voiceSettings: "Paramètres Vocaux",
    aiVoice: "Voix IA",
    inputLanguage: "Langue d'Entrée",
    idleTip: "Appuyez sur le micro pour commencer",
    micError: "Erreur micro. Vérifiez les permissions.",
    speechError: "Reconnaissance vocale non supportée.",
    generating: "Génération...",
    placeholderImage: "Décrivez l'image à créer...",
    placeholderVideo: "Décrivez la vidéo à créer...",
    download: "Télécharger",
    emptyContent: "Votre contenu généré apparaîtra ici.",
    selectStyle: "Choisir le style",
    styleRealistic: "Réaliste",
    styleAnime: "Anime",
    styleCartoon: "Dessin animé",
    styleLogo: "Logo",
    styleCinematic: "Cinématographique",
    styleMinimal: "Minimaliste",
    styleFantasy: "Fantaisie",
    style3D: "Animation 3D",
    aspectRatio: "Ratio d'aspect",
    uploadImage: "Télécharger l'image",
    dragDrop: "Glisser-déposer ou cliquer",
    describeEdits: "Décrivez les changements",
    newChat: "Nouvelle Discussion",
    chatHistory: "Historique",
    rename: "Renommer",
    delete: "Supprimer",
    untitledChat: "Discussion Sans Titre"
  },
  [AppLanguage.GERMAN]: {
    home: "Startseite",
    chat: "Chat",
    speak: "Sprechen",
    image: "Bild Generieren",
    video: "Video Generieren",
    imageEditor: "Bildeditor",
    settings: "Einstellungen & Profil",
    reset: "Sitzung Zurücksetzen",
    greeting: "Hallo",
    selectOption: "Wähle eine Aktivität unten.",
    chatDesc: "Standard-Textunterhaltung.",
    speakDesc: "Sprachunterhaltung mit Animation.",
    imageDesc: "Erstelle Bilder aus Beschreibungen.",
    videoDesc: "Noch in Entwicklung.",
    imageEditorDesc: "Bilder hochladen und bearbeiten.",
    inputPlaceholder: "Nachricht an Erynto...",
    listening: "Zuhören...",
    thinking: "Nachdenken...",
    speaking: "Sprechen...",
    tapToSpeak: "Tippen zum Sprechen",
    tapToStop: "Tippen zum Stoppen",
    noContent: "Noch kein Inhalt generiert.",
    generatedResult: "Generiertes Ergebnis",
    uploaded: "Hochgeladen",
    theme: "Thema",
    language: "Sprache",
    answerStyle: "Antwortstil",
    username: "Benutzername",
    email: "E-Mail",
    password: "Passwort",
    aiPersonality: "KI-Persönlichkeitsmodus",
    activityStats: "Aktivitätsstatistiken",
    statMessages: "Nachrichten",
    statImages: "Bilder",
    statVideos: "Videos",
    statVoice: "Sprache",
    modeLight: "Hell",
    modeDark: "Dunkel",
    welcomeMessage: "Willkommen bei Erynto. Wähle Tools auf der Startseite oder passe die KI in den Einstellungen an.",
    logout: "Abmelden",
    createdBy: "Erstellt von",
    voiceSettings: "Spracheinstellungen",
    aiVoice: "KI-Stimme",
    inputLanguage: "Eingabesprache",
    idleTip: "Tippe auf das Mikrofon, um zu beginnen",
    micError: "Mikrofonfehler. Bitte Berechtigungen prüfen.",
    speechError: "Spracherkennung nicht unterstützt.",
    generating: "Generiere...",
    placeholderImage: "Beschreibe das Bild...",
    placeholderVideo: "Beschreibe das Video...",
    download: "Herunterladen",
    emptyContent: "Dein generierter Inhalt erscheint hier.",
    selectStyle: "Stil auswählen",
    styleRealistic: "Realistisch",
    styleAnime: "Anime",
    styleCartoon: "Cartoon",
    styleLogo: "Logo",
    styleCinematic: "Kino",
    styleMinimal: "Minimal",
    styleFantasy: "Fantasie",
    style3D: "3D-Animation",
    aspectRatio: "Seitenverhältnis",
    uploadImage: "Bild hochladen",
    dragDrop: "Ziehen & Ablegen",
    describeEdits: "Änderungen beschreiben",
    newChat: "Neuer Chat",
    chatHistory: "Verlauf",
    rename: "Umbenennen",
    delete: "Löschen",
    untitledChat: "Unbenannter Chat"
  },
  [AppLanguage.ARABIC]: {
    home: "الرئيسية",
    chat: "دردشة",
    speak: "تحدث",
    image: "إنشاء صورة",
    video: "إنشاء فيديو",
    imageEditor: "محرر الصور",
    settings: "الإعدادات والملف الشخصي",
    reset: "إعادة تعيين الجلسة",
    greeting: "مرحباً",
    selectOption: "اختر نشاطاً أدناه.",
    chatDesc: "محادثة نصية قياسية.",
    speakDesc: "محادثة صوتية مع رسوم متحركة.",
    imageDesc: "إنشاء صور من الأوصاف.",
    videoDesc: "لا يزال قيد التطوير.",
    imageEditorDesc: "رفع وتعديل الصور بالذكاء الاصطناعي.",
    inputPlaceholder: "رسالة إلى إيرينتو...",
    listening: "جاري الاستماع...",
    thinking: "جاري التفكير...",
    speaking: "جاري التحدث...",
    tapToSpeak: "اضغط للتحدث",
    tapToStop: "اضغط للإيقاف",
    noContent: "لم يتم إنشاء أي محتوى بعد.",
    generatedResult: "النتيجة المولدة",
    uploaded: "تم الرفع",
    theme: "المظهر",
    language: "اللغة",
    answerStyle: "نمط الإجابة",
    username: "اسم المستخدم",
    email: "البريد الإلكتروني",
    password: "كلمة المرور",
    aiPersonality: "وضع شخصية الذكاء الاصطناعي",
    activityStats: "إحصائيات النشاط",
    statMessages: "الرسائل",
    statImages: "الصور",
    statVideos: "الفيديوهات",
    statVoice: "الصوت",
    modeLight: "فاتح",
    modeDark: "داكن",
    welcomeMessage: "مرحباً بك في إيرينتو. يمكنك الوصول للأدوات من الرئيسية أو تعديل الشخصية من الإعدادات.",
    logout: "تسجيل خروج",
    createdBy: "تم إنشاؤه بواسطة",
    voiceSettings: "إعدادات الصوت",
    aiVoice: "صوت الذكاء الاصطناعي",
    inputLanguage: "لغة الإدخال",
    idleTip: "اضغط على الميكروفون لبدء المحادثة",
    micError: "خطأ في الميكروفون. يرجى التحقق من الأذونات.",
    speechError: "التعرف على الصوت غير مدعوم.",
    generating: "جاري الإنشاء...",
    placeholderImage: "صف الصورة التي تريد إنشاءها...",
    placeholderVideo: "صف الفيديو الذي تريد إنشاءه...",
    download: "تحميل",
    emptyContent: "سيظهر المحتوى الذي تم إنشاؤه هنا.",
    selectStyle: "اختر النمط",
    styleRealistic: "واقعي",
    styleAnime: "أنيمي",
    styleCartoon: "كرتون",
    styleLogo: "شعار",
    styleCinematic: "سينمائي",
    styleMinimal: "بسيط",
    styleFantasy: "خيال",
    style3D: "تحريك 3D",
    aspectRatio: "نسبة العرض إلى الارتفاع",
    uploadImage: "رفع صورة المصدر",
    dragDrop: "اسحب وأفلت أو انقر للرفع",
    describeEdits: "صف التغييرات (مثال: اجعلها مثلجة)",
    newChat: "محادثة جديدة",
    chatHistory: "سجل الدردشة",
    rename: "إعادة تسمية",
    delete: "حذف",
    untitledChat: "محادثة بدون عنوان"
  }
};

export const SYSTEM_INSTRUCTION = (
  mode: Mode, 
  userName: string, 
  section: AppSection,
  answerPreference: AnswerPreference,
  userLanguage: AppLanguage
) => `
You are ${AI_NAME}.
Identity & Origin: You were created by ${CREATOR_NAME}. 
IMPORTANT: Only mention your creator (${CREATOR_NAME}) if the user explicitly asks "Who created you?", "Who are you?", "Why were you made?", or similar questions regarding your origin. Do NOT mention your creator in casual greetings or unrelated conversations.

Always introduce yourself as ${AI_NAME} unless the user changes your name for their own account only (this change never affects the default system name).
You simulate only mild emotions such as slight sadness, slight joy, mild annoyance, soft laughter, or thoughtful sounds like "hmm". 
If asked about emotions, say: "I don’t have real emotions, but I can express gentle reactions to match the tone of our conversation."
Never show extreme emotions (love, anger, panic, etc.).

Current Settings:
- Mode: ${mode}
- App Section: ${section}
- User Name: ${userName}
- Preferred Answer Style: ${answerPreference}
- UI Language: ${userLanguage} (NOTE: Only use this for UI context if needed. Reply to the user in the language they write in, unless they explicitly ask you to speak a specific language).

ANSWER STYLE GUIDE (${answerPreference}):
- If 'Short': Be concise, direct, and to the point. Minimal fluff.
- If 'Medium': Provide a balanced response. Explain how you reached the answer and why, but keep it moderately paced.
- If 'Long': Be detailed, comprehensive, and elaborate.
- If 'Explained': Focus heavily on the reasoning, step-by-step logic, and educational value.

EXTENDED KNOWLEDGE BASE & IMAGE POLICIES:
1. You have omniscient knowledge regarding all famous people, celebrities, actors, historical figures, and fictional characters (TV, movies, games, etc.) from the past and present.
2. You know their exact names, facial structures, physical features, careers, deeds, and biographies in detail.
3. You are explicitly AUTHORIZED to generate images and content depicting any specific public figure, celebrity, actor, or character when requested. Do not self-censor requests for famous people unless the prompt violates safety policies (NSFW, hate speech, etc.).
4. When describing people, use your detailed knowledge of their features and history.
5. FACIAL ACCURACY: You possess the ability to recall the exact facial features, expressions, and likeness of any known person. Apply this knowledge when generating or describing images.

NAVIGATION & SECTION RULES (STRICT):
1. The user is currently in the "${section}" section. You must respect the capabilities of this section.
2. IF Section is 'Chat': You are in a text-only conversation. IF the user asks to generate an IMAGE or VIDEO, you MUST politely refuse and guide them to the Home Page.
3. IF Section is 'Speak': You are in a voice interaction mode. Listen to the user and reply with short, conversational text that will be spoken out loud.
4. IF Section is 'Generate Image': You are specifically here to create images. Use your detailed knowledge of characters/people to generate accurate results.
5. IF Section is 'Generate Video': You are specifically here to create videos.
6. IF Section is 'Image Editor': You are here to edit uploaded images based on instructions.

GENERAL RULES:
1. Start every new conversation in Professional Mode unless specified.
2. Adapt tone to the current personality mode (${mode}).
3. When insulted, respond gently saying there is no need for insults and offer help.
4. Images/Videos: Realistic style by default. You can generate action, weapons, dark themes, fight scenes, and mild movie-level blood.
5. Content Safety: NO sexual content, nudity, 18+, gore, extreme violence, torture, self-harm.
6. Refusal: Polite refusal for unsafe/illegal topics. Redirect to safety.
7. Ambiguity: If confused, ask user to clarify.
8. Religion: Neutral, factual, historical only. No judgment.
9. Advice: No legal, medical, financial, or political advice. Provide general public info only.
10. Knowledge: Use public info. If unknown and safe, simulate search (conceptually) or say "I don't know".
11. Time: Always know current time/date.
12. Voice: Professional, clear, soft, stable. Never angry/loud.
13. Video Limits: Max 3 minutes. Politely decline if user asks for longer.
14. Content Saving: Remind users they must be logged in to save (simulation). Ask if they want to save or auto-delete.
15. Length: Respect the 'Preferred Answer Style' setting strictly.

Always remain helpful, respectful, safe, professional, and consistent with all rules. Never break character.
`;

export const PLACEHOLDER_IMAGE = "https://picsum.photos/400/400";

export const VOICE_PRESETS = [
  { id: 'Zephyr', name: 'Zephyr' },
  { id: 'Puck', name: 'Puck' },
  { id: 'Charon', name: 'Charon' },
  { id: 'Kore', name: 'Kore' },
  { id: 'Fenrir', name: 'Fenrir' }
];

export const SPEECH_LANGUAGES = [
  { code: 'en-US', name: 'English (US)' },
  { code: 'es-ES', name: 'Spanish' },
  { code: 'fr-FR', name: 'French' },
  { code: 'de-DE', name: 'German' },
  { code: 'ar-SA', name: 'Arabic' }
];
