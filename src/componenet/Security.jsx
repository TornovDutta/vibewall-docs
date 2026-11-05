import React, { useState } from 'react'

const securityModules = [
  {
    id: 'encryption',
    title: 'AES-256-GCM Encryption',
    file: 'Encryption.java',
    description: 'Server-side encryption at rest using AES/GCM/NoPadding with a 128-bit authentication tag and deterministic IV derived from SHA-256 for encrypted lookups.',
    code: `// Encryption.java (Spring Service)
@Service
public class Encryption {
    private static final int GCM_IV_LENGTH = 12;
    private static final int GCM_TAG_LENGTH = 128;

    @Value("\${encryption.key}")
    private String encryptionKeyBase64;
    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        byte[] keyBytes = Base64.getDecoder().decode(encryptionKeyBase64);
        this.secretKey = new SecretKeySpec(keyBytes, "AES");
    }

    public String encode(String str) {
        if (str == null) return null;
        // Deterministic IV ensures identical ciphertext for DB lookups
        byte[] digest = MessageDigest.getInstance("SHA-256").digest(str.getBytes(StandardCharsets.UTF_8));
        byte[] iv = Arrays.copyOf(digest, GCM_IV_LENGTH);

        Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey, new GCMParameterSpec(GCM_TAG_LENGTH, iv));

        byte[] ciphertext = cipher.doFinal(str.getBytes(StandardCharsets.UTF_8));
        byte[] combined = new byte[GCM_IV_LENGTH + ciphertext.length];
        System.arraycopy(iv, 0, combined, 0, GCM_IV_LENGTH);
        System.arraycopy(ciphertext, 0, combined, GCM_IV_LENGTH, ciphertext.length);

        return Base64.getEncoder().encodeToString(combined);
    }
}`
  },
  {
    id: 'ai-moderation',
    title: 'NVIDIA NIM Content Moderation',
    file: 'NvidiaAiServiceImpl.java',
    description: 'Calls Meta Llama 3.1 8B Instruct via NVIDIA NIM REST API. Returns 1 (block) or 0 (allow). Throws UnsafeContentException (422) if flagged.',
    code: `// NvidiaAiServiceImpl.java (Spring Service)
@Service
@Primary
public class NvidiaAiServiceImpl implements AiService {
    @Value("\${nvidia.api.key}")
    private String apiKey;

    private static final String NVIDIA_URL = "https://integrate.api.nvidia.com/v1/chat/completions";
    private static final String MODEL = "meta/llama-3.1-8b-instruct";

    private static final String MODERATION_SYSTEM_PROMPT =
        "You are a content moderator for VibeWall, a student social platform. " +
        "Reply ONLY with 1 (block) or 0 (allow). No explanation.\\n\\n" +
        "BLOCK (1) - insults, harassment, threats, hate speech, self-harm, explicit material.\\n" +
        "ALLOW (0) - feelings, sadness, stress, advice, friendly or neutral venting.";

    @Override
    public boolean unSafe(String str) {
        String body = buildChatBody(MODERATION_SYSTEM_PROMPT, "Message: " + str, 5);
        ResponseEntity<String> response = restTemplate.postForEntity(
            NVIDIA_URL,
            new HttpEntity<>(body, buildHeaders()),
            String.class
        );
        return parseModeration(response.getBody());
    }
}`
  },
  {
    id: 'rbac',
    title: 'Spring Security & RBAC',
    file: 'SecurityConfig.java',
    description: 'Stateless JWT authentication filter chain, role-based authorization for Public, USER, and ADMIN, BCrypt password hashing, and HSTS protection.',
    code: `// SecurityConfig.java
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {
    private final CustomUserDetailsService detailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers(
                    "/auth/**",
                    "/feed/**",
                    "/health",
                    "/swagger-ui/**",
                    "/swagger-ui.html",
                    "/api-docs/**"
                ).permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/users/**").authenticated()
                .anyRequest().authenticated()
            );

        http.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }
}`
  },
  {
    id: 'jwt-rotation',
    title: 'Refresh Token Rotation',
    file: 'RefreshTokenServiceImpl.java',
    description: 'Issues a 7-day UUID refresh token stored in MongoDB. Old refresh token is immediately deleted upon issuance, preventing replay attacks.',
    code: `// RefreshTokenServiceImpl.java
@Service
@RequiredArgsConstructor
public class RefreshTokenServiceImpl implements RefreshTokenService {
    private final RefreshTokenRepository repo;
    private final long REFRESH_EXPIRATION = 7 * 24 * 60 * 60; // 7 days

    public RefreshToken createRefreshToken(String userId) {
        // Enforce single active session per user - delete old tokens
        repo.deleteByUserId(userId);

        RefreshToken refreshToken = RefreshToken.builder()
            .userId(userId)
            .token(UUID.randomUUID().toString())
            .expiryDate(Instant.now().plusSeconds(REFRESH_EXPIRATION))
            .build();

        return repo.save(refreshToken);
    }
}`
  },
  {
    id: 'ttl-deletion',
    title: '12h Auto-Deletion (TTL)',
    file: 'Confession.java',
    description: 'MongoDB Atlas TTL index configured via @Indexed(expireAfter = "PT12H") automatically purges documents 12 hours after creation.',
    code: `// Confession.java (MongoDB Document)
@Document(collection = "confessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Confession {
    @Id
    private String id;

    @NotBlank
    private String content; // Stored AES-256-GCM encrypted

    private String userId;

    @CreatedDate
    @Indexed(expireAfter = "PT12H") // 12-hour automated expiry index
    private Date time;

    private List<Feedback> feedbacks = new ArrayList<>();
}`
  }
]

function Security({ SectionHeading }) {
  const [activeTab, setActiveTab] = useState(0)
  const current = securityModules[activeTab]

  return (
    <section className="space-y-8">
      <SectionHeading
        label="SECURITY_BLUEPRINT"
        title="Zero-Trust &amp; Defense-in-Depth Architecture"
        description="Inspect the actual Java & Spring implementation powering VibeWall's encryption, AI moderation, stateless JWT rotation, and ephemeral storage."
      />

      {/* Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-800 pb-3">
        {securityModules.map((mod, idx) => (
          <button
            key={mod.id}
            onClick={() => setActiveTab(idx)}
            className={`rounded-lg px-3 py-1.5 text-xs font-mono transition ${
              idx === activeTab
                ? 'bg-indigo-500/20 text-white border border-indigo-500/40'
                : 'text-slate-400 hover:bg-gray-800/60 hover:text-slate-200'
            }`}
          >
            {mod.file}
          </button>
        ))}
      </div>

      {/* Code Display Card */}
      <div className="card overflow-hidden border-gray-800 bg-gray-950/80">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-800/80 bg-gray-900/60 px-5 py-3 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="text-slate-200 font-semibold">{current.title}</span>
            <span className="text-slate-500">({current.file})</span>
          </div>
          <span className="text-indigo-400 text-[11px]">Production Implementation</span>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-xs text-slate-300 font-mono leading-relaxed bg-indigo-500/10 border border-indigo-500/20 rounded-lg p-3">
            <strong className="text-indigo-300">Design Note: </strong>
            {current.description}
          </p>

          <pre className="overflow-x-auto rounded-lg bg-black/60 p-4 font-mono text-xs leading-relaxed text-slate-200 border border-gray-800">
            <code>{current.code}</code>
          </pre>
        </div>
      </div>
    </section>
  )
}

export default Security