/* ------------------------------------------------------------
 * AlternativeFull
 * ------------------------------------------------------------ */
/* created by AlternativeFullFrontend. */
#define TEXTURE_THRESHOLD "shading_hint_katturi.png"
#define TEXTURE_SHADOW "TEX2_shadow_tex.png"
#define USE_EXCELLENT_SHADOW_SYSTEM
#define USE_SELFSHADOW_MODE
#define USE_NONE_SELFSHADOW_MODE
float SelfShadowPower = 1;
#define USE_MATERIAL_SPECULAR
#define USE_MATERIAL_SPHERE
#define USE_SPHERE_CHEET
float SphereBoost = 0.73;
float3 DefaultModeShadowColor = {1,1,1};
#define MAX_ANISOTROPY 16

#include "AlternativeFull.fxsub"
