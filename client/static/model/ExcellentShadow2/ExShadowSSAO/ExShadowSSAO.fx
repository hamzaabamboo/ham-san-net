//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//�@����SSAO �G�t�F�N�g ���i���� v0.5a�x�[�X0.1 ExcellentShadow�p
//�@�@�@based by mqdl�A��������iuser/5145841�j
//�@�@�@by ���ڂ�
//
//�@�@�@�����̃G�t�F�N�g�� mqdl ����� SSAO �G�t�F�N�g��
//�@�@�@�@�������񂳂񂪉��ς������̂�����ɉ��ς������̂ł�
//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

//-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
//�@���[�U�[�p�����[�^

//�@�񓧉߃��[�h�i 0: ���������͂��̂܂܏o�́A1: ���������𔒔w�i�Ƃ��ďo�́j
#define NON_TRANSPARENT 1

//�@�\�����[�h ( 0�F�G�t�F�N�g�K�p���ʂ�\���A1�FSSAO�e������\��)
//�@�� MMD ��� MME �ł̂ݗL���Ȑݒ�ł��BMMM �ł̓p�����[�^�R���g���[���́u�e�̂ݕ`��v�����g�p���������B
#define ShowSHADOW  0

//�@�V���[�g�����W DLAA �� SSAO �e�̃G�b�W�����炩�ɂ��� ( 0�F�������Ȃ��i�K�^�K�^�����y���H�j�A1�F���炩�ɂ���)
#define usePostAntiAlias 1


#define EXPORTOR //�e�x�}�b�v�G�N�X�|�[�^�[�Ƃ��ē��삷��


/* �ȉ��̉���� mqdl ����̃I���W�i������ύX���Ă��܂���B
���T�v
MMD��SSAO(Screen Space Ambient Occlusion)���ʂ�������
MME�̃|�X�g�G�t�F�N�g�ł��B
�X�N���[����̏������S��3D��Ԃł͂Ȃ��A2.5D���
�v�Z���A�[���I�ȃA���r�G���g�I�N���[�W�������ʂ������܂��B

�s�N�Z���V�F�[�_3.0�K�{�B
��r�I�傫�ȃr�f�I���������g�p����̂ŁAVRAM512MB�ȏ��
�r�f�I�J�[�h�𐄏����܂��B

���Ɛ�
�@�{�\�t�g�E�F�A�͌���̂܂ܒ񋟂���܂��B
�@�{�\�t�g�E�F�A�̎g�p�ɂ�鑹�Q�ɑ΂��ē����͈�ؐӔC�𕉂��܂���B

���ӎ�
�G�t�F�N�g�쐬�ɂ������āA���͉��P�A���ڂ�P�A�r�[���}��P��
�\�[�X���Q�l�ɂ����Ă��������܂����B
�܂��A�F�l�̂����͂Ɋ��ӂ������܂��B

���g����
�Y�t��SSAO.x��MMD�œǂݍ���ŉ������B

���p�����[�^�Ɋւ���

density:
�@SSAO���ʂ��ŏI�I�Ɍ������Z�x�ł��B
�@���܂�Z�����߂���Ƃ������ȉf���ɂȂ鎖������܂��B
�@�i��������SSAO�͋[���I�ȃA���r�G���g�I�N���[�W�����v�Z�ł��̂�
�@�@�s���Ȍ��ʂ��ڗ����ɂȂ�܂��j

strength:
falloff:
�@�s�N�Z�������΂����������B����Ԃł��邩�ۂ���
�@����Ɏg�p���܂��B
�@�V�[���ɍœK�Ȍ��ʂ�������l�ɓK�X�������ĉ������B

rad:
�@�v�Z�Ɏg�p����������΂����a�ł��B

blur:
�@SSAO���ʂ̂ڂ����ʂł��B
�@���������߂���ƃm�C�Y���������܂��B
�@�傫����������Ƃڂ�����ʂɂȂ�̂ł����Ӊ������B

dotRange:
�@�u���[��������ۂɁA�G�b�W�ߕӂł��邩��
�@���肷��ׂ̒l�ł��B
�@0�`1.0�܂ł̒l���w�肵�ĉ������B
�@
*/

//-----------------------------------------------------
//�p�����[�^

float density        // 10.0 * Si
<
    string UIName = "�e�Z�x";
    string UIWidget = "Spinner";
    bool UIVisible =  true;
    float UIMin = 0.0;
    float UIMax = 20.0;
> = 2.0;

float strength        // 0.006667 * (X + 1)
<
    string UIName = "���苭�x";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.1;
    float UIMax = 10;
> = 1.0;

float falloff    // 0.000001 * (Y + 1)
<
    string UIName = "���茸���x";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.1;
    float UIMax = 10;
> = 1.0;

float optimize        // 0.7 * Tr
<
    string UIName = "MMD�œK���x";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.0;
    float UIMax = 1.0;
> = 0.7;

float blur        // 1.0 + Z
<
    string UIName = "�{�J����";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.1;
    float UIMax = 3.0;
> = 0.8;

float rad        // 0.1
<
    string UIName = "���a";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.01;
    float UIMax = 0.5;
> = 0.05;

float dotRange        // 0.5
<
    string UIName = "�G�b�W����l";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.1;
    float UIMax = 1.0;
> = 0.4;

float depthRange    // 0.006
<
    string UIName = "�[�x����l";
    string UIWidget = "Slider";
    bool UIVisible =  true;
    float UIMin = 0.001;
    float UIMax = 0.010;
> = 0.006;



//-----------------------------------------------------
//���������̓G�t�F�N�g�ɏڂ������͂�����Ȃ��ق����ǂ��ł�

#define SAMPLES    10    // SSAO �e����̃T���v����

#if SAMPLES == 16
float3 samples[16] = {
    float3(0.53812504, 0.18565957, -0.43192),
    float3(0.13790712, 0.24864247, 0.44301823),
    float3(0.33715037, 0.56794053, -0.005789503),
    float3(-0.6999805, -0.04511441, -0.0019965635),
    float3(0.06896307, -0.15983082, -0.85477847),
    float3(0.056099437, 0.006954967, -0.1843352),
    float3(-0.014653638, 0.14027752, 0.0762037),
    float3(0.010019933, -0.1924225, -0.034443386),
    float3(-0.35775623, -0.5301969, -0.43581226),
    float3(-0.3169221, 0.106360726, 0.015860917),
    float3(0.010350345, -0.58698344, 0.0046293875),
    float3(-0.08972908, -0.49408212, 0.3287904),
    float3(0.7119986, -0.0154690035, -0.09183723),
    float3(-0.053382345, 0.059675813, -0.5411899),
    float3(0.035267662, -0.063188605, 0.54602677),
    float3(-0.47761092, 0.2847911, -0.0271716)
};

#elif SAMPLES == 12
float3 samples[12] = {
    float3(-0.13657719, 0.30651027, 0.16118456),
    float3(-0.14714938, 0.33245975, -0.113095455),
    float3(0.030659059, 0.27887347, -0.7332209),
    float3(0.009913514, -0.89884496, 0.07381549),
    float3(0.040318526, 0.40091, 0.6847858),
    float3(0.22311053, -0.3039437, -0.19340435),
    float3(0.36235332, 0.21894878, -0.05407306),
    float3(-0.15198798, -0.38409665, -0.46785462),
    float3(-0.013492276, -0.5345803, 0.11307949),
    float3(-0.4972847, 0.037064247, -0.4381323),
    float3(-0.024175806, -0.008928787, 0.17719103),
    float3(0.694014, -0.122672155, 0.33098832)
};

#elif SAMPLES == 8
float3 samples[8] = {
    float3(0.24710192, 0.6445882, 0.033550154),
    float3(0.00991752, -0.21947019, 0.7196721),
    float3(0.25109035, -0.1787317, -0.011580509),
    float3(-0.08781511, 0.44514698, 0.56647956),
    float3(-0.011737816, -0.0643377, 0.16030222),
    float3(0.035941467, 0.04990871, -0.46533614),
    float3(-0.058801126, 0.7347013, -0.25399926),
    float3(-0.24799341, -0.022052078, -0.13399573)
};

#else
float3 samples[10] = {
    float3(-0.010735935, 0.01647018, 0.0062425877),
    float3(-0.06533369, 0.3647007, -0.13746321),
    float3(-0.6539235, -0.016726388, -0.53000957),
    float3(0.40958285, 0.0052428036, -0.5591124),
    float3(-0.1465366, 0.09899267, 0.15571679),
    float3(-0.44122112, -0.5458797, 0.04912532),
    float3(0.03755566, -0.10961345, -0.33040273),
    float3(0.019100213, 0.29652783, 0.066237666),
    float3(0.8765323, 0.011236004, 0.28265962),
    float3(0.29264435, -0.40794238, 0.15964167)
};
#endif

#define fmRange    0.8f
#define DepthThreshold 0.8
#define DepthSensitivity 5
#define SAMP_NUM 10

#define rnd_offset 18.0f
#define invSamples (1.0f / SAMPLES)

float    pix_offsets[16] = {
    -1.0f,1.0f,
    -2.0f,2.0f,
    -3.0f,3.0f,
    -4.0f,4.0f,
    -5.0f,5.0f,
    -6.0f,6.0f,
    -7.0f,7.0f,
    -8.0f,8.0f
};


float Script : STANDARDSGLOBAL <
    string ScriptOutput = "color";
    string ScriptClass = "scene";
    string ScriptOrder = "postprocess";
> = 0.8;

float3   CameraDirection    : DIRECTION < string Object = "Camera"; >;


//�@�A�N�Z�T������ݒ�l���擾
float alpha : CONTROLOBJECT < string name = "(self)"; string item = "Tr"; >;

float scaling0 : CONTROLOBJECT < string name = "(self)"; >;
static float scaling = scaling0 * 0.1;

float3 ObjXYZ0 : CONTROLOBJECT < string name = "(self)"; string item = "XYZ"; >;
static float3 ObjXYZ = ObjXYZ0 + 1.0f;

// �X�N���[���T�C�Y
float2 ViewportSize : VIEWPORTPIXELSIZE;

static float2 ViewportOffset = float2(0.5, 0.5) / ViewportSize;
static float2 SampStep = float2(blur + ObjXYZ0.z, blur + ObjXYZ0.z) / ViewportSize;
static float2 halfPixel = float2(1.0f, 1.0f) / (ViewportSize * 2);
static float2 fullPixel = float2(1.0f, 1.0f) / (ViewportSize);
static float AspectRatio = (ViewportSize.x / ViewportSize.y);

// �����_�����O�^�[�Q�b�g�̃N���A�l
#if NON_TRANSPARENT
float4 ClearColor = {1,1,1,1};
#else
float4 ClearColor = {0,0,0,0};
#endif
float ClearDepth  = 1.0;



//-----------------------------------------------------------------------------
// �[�x�o�b�t�@
//
//-----------------------------------------------------------------------------
texture2D DepthBuffer : RENDERDEPTHSTENCILTARGET <
    float2 ViewPortRatio = {1.0,1.0};
    string Format = "D24S8";
>;


#ifndef EXPORTOR

//-----------------------------------------------------------------------------
// �I���W�i���̕`�挋�ʂ��L�^���邽�߂̃����_�[�^�[�Q�b�g
//
//-----------------------------------------------------------------------------
texture2D ScnMap : RENDERCOLORTARGET <
    float2 ViewPortRatio = {1.0,1.0};
    int MipLevels = 1;
    string Format = "A16B16G16R16F";
>;
sampler2D ScnSamp = sampler_state {
    texture = <ScnMap>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = NONE;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};

#endif

//-----------------------------------------------------------------------------
// �T���v�����O�̌��ʂ��L�^���邽�߂̃����_�[�^�[�Q�b�g
//
//-----------------------------------------------------------------------------
texture2D SSAOMapRT : RENDERCOLORTARGET <
    float2 ViewPortRatio = {1.0,1.0};
    int MipLevels = 1;
    string Format = "R16F";
    
>;
sampler2D SSAOMap = sampler_state {
    texture = <SSAOMapRT>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = NONE;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};

//-----------------------------------------------------------------------------
// �ڂ����̌��ʂ��L�^���邽�߂̃����_�[�^�[�Q�b�g
//
//-----------------------------------------------------------------------------
texture2D BlurMapRT : RENDERCOLORTARGET <
    float2 ViewPortRatio = {1.0,1.0};
    int MipLevels = 1;
    string Format = "R16F";
    
>;
sampler2D BlurMap = sampler_state {
    texture = <BlurMapRT>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = NONE;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};

//-----------------------------------------------------------------------------
// �e�x�}�b�v�o�͌��ʂ��L�^���邽�߂̃����_�[�^�[�Q�b�g
//
//-----------------------------------------------------------------------------

#ifdef EXPORTOR
shared texture2D ExShadowSSAOMapOut : RENDERCOLORTARGET <
#else
texture2D ExShadowSSAOMapOut : RENDERCOLORTARGET <
#endif
    float2 ViewPortRatio = {1.0,1.0};
    int MipLevels = 1;
    string Format = "R16F";
>;

sampler2D ExShadowSSAOMapSamp = sampler_state {
    texture = <ExShadowSSAOMapOut>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = NONE;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};


//-----------------------------------------------------------------------------
//�����e�N�X�`��
//
//-----------------------------------------------------------------------------
texture2D rndTex <
    string ResourceName = "rand.dds";
>;
sampler RandomMap = sampler_state {
    texture = <rndTex>;
};


//-----------------------------------------------------------------------------
// MMD�{����sampler���㏑�����Ȃ����߂̋L�q�ł��B�폜�s�B
#ifndef MIKUMIKUMOVING
sampler MMDSamp0 : register(s0);
sampler MMDSamp1 : register(s1);
sampler MMDSamp2 : register(s2);
#endif


//-----------------------------------------------------------------------------
// �@���}�b�v
//
//-----------------------------------------------------------------------------
texture NormalMapRT: OFFSCREENRENDERTARGET <
    string Description = "SvSSAO �p�ɃI�u�W�F�̖ʕ�����`�悷��i�@���}�b�v�j";
    float4 ClearColor = {0,0,0,1};
    float ClearDepth = 1.0;
    string Format = "X8R8G8B8";
    bool AntiAlias = true;
    string DefaultEffect = 
        "self = hide;"
        "LineSystem* = hide;"
        "* = NormalMap.fxsub";
>;

sampler NormalMap = sampler_state {
    texture = <NormalMapRT>;
    AddressU  = CLAMP;
    AddressV = CLAMP;
    Filter = NONE;
};

//-----------------------------------------------------------------------------
// �[�x�}�b�v
//
//-----------------------------------------------------------------------------
texture DepthMapRT: OFFSCREENRENDERTARGET <
    string Description = "SvSSAO �p�ɉ��s��`�悷��i�[�x�}�b�v�j";
    float4 ClearColor = {0,1,0,1};
    float ClearDepth = 1.0;
    string Format = "D3DFMT_G32R32F" ;
    bool AntiAlias = false;
    string DefaultEffect = 
        "self = hide;"
        "LineSystem* = hide;"
        "* = DepthMap.fxsub";
>;

sampler DepthMap = sampler_state {
    texture = <DepthMapRT>;
    AddressU  = CLAMP;
    AddressV = CLAMP;
    Filter = NONE;
};


//-----------------------------------------------------------------------------
// �Œ��`
//
//-----------------------------------------------------------------------------
struct VS_OUTPUT
{
    float4 Pos        : POSITION;
    float2 TexCoord   : TEXCOORD0;
    float2 TexCoord2  : TEXCOORD2;
    float  Rang       : TEXCOORD1;
};

//-----------------------------------------------------------------------------
// SSAO
//-----------------------------------------------------------------------------
VS_OUTPUT VS_SSAO(float4 Pos:POSITION, float2 Tex:TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0; 
    
    Out.Pos = Pos;
    Out.TexCoord = Tex + ViewportOffset;
    
    return Out;
}

float ExSdSSAO_GetDepth(float2 tex){
    
    float d = tex2D(DepthMap, tex).g;
    
    d = 1 - 1 / d;
    
    return d;
}

float ExSdSSAO_GetZ(float2 tex){
    
    float d = tex2D(DepthMap, tex).r;
    
    return d;
}

float4 PS_SSAO(float2 inTex: TEXCOORD0) : COLOR
{
    
    float3 fres = normalize((tex2D(RandomMap, inTex * rnd_offset).xyz * 2.0f) - 1.0f);
    
    float  currentPixelDepth = ExSdSSAO_GetZ(inTex);
    float4 currentPixelSample = tex2D(NormalMap, inTex);
    
    float  w1 = tex2D(DepthMap, inTex).g;
    float  w2 = pow(max(0.5, w1), 0.4);
    
    float  radD = rad * (5.0 / w2 + 0.3);
    float3 norm = normalize(currentPixelSample.xyz * 2.0f - 1.0f);
    
    float  occluderDepth, depthDifference, normDiff, bl = 0.0f, finalColor = 0.0f;
    float2 se;
    float3 ray, occNorm;
    
    
    float falloff_e = (w1 * 0.005 + w2 * 0.05) * falloff * ObjXYZ.y;
    float strength_e = (w1 * 0.05 + w2 * 2) * strength * ObjXYZ.x;
    
    for(int i = 0; i < SAMPLES ; i++)
    {
        ray = radD * reflect(samples[i], fres);
        se = inTex + sign(dot(ray, norm)) * ray.xy * float2(1.0f, -1.0f);
        occNorm = normalize(tex2D(NormalMap, se).xyz * 2.0f - 1.0f);
        
        depthDifference = currentPixelDepth - ExSdSSAO_GetZ(se);
        normDiff = 1.0f - dot(occNorm, norm);
        
        bl += smoothstep(0, falloff_e, depthDifference)
            * (1.0f - pow(smoothstep(falloff_e, strength_e, depthDifference), 0.5)) * normDiff;
        
    }
    
    float ao = density * bl * invSamples * scaling;
    ao *= (1 + min(w1 / 120, 2)); //��������
    ao = max(0, ao);
    ao = pow(ao * 1.5, max(0.5, 1.5 - ao)) / 1.5; //���炩�֐�
    
    
    //ao = 1.0f - sp;
    
    return  float4(ao, ao, ao, 1.0f);
    
}


//-----------------------------------------------------------------------------
// BlurXY
//-----------------------------------------------------------------------------
VS_OUTPUT VS_BlurX(float4 Pos:POSITION, float2 Tex:TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0; 
    
    Out.Pos = Pos;
    Out.TexCoord = Tex + ViewportOffset;
    Out.TexCoord2 = Tex + ViewportOffset;
    Out.Rang = 1;
    
    return Out;
}

VS_OUTPUT VS_BlurY(float4 Pos:POSITION, float2 Tex:TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0; 
    
    float2 c = float2(0.5, 0.5);
    
    Out.Pos = Pos;
    Out.TexCoord = (Tex + ViewportOffset - c) * fmRange + c;
    Out.TexCoord2 = Tex + ViewportOffset;
    Out.Rang = fmRange;
    
    return Out;
}

float4 PS_BlurXY( VS_OUTPUT IN , uniform bool Horizontal , uniform sampler2D samp ) : COLOR
{
    float2 inTex = IN.TexCoord;
    float  ao = tex2D(samp, inTex).r, cnt = 1.0f;
    float2 uv;
    float3 nv = tex2D(NormalMap, inTex).xyz * 2.0f - 1.0f, sample_nv;
    float  Depth = saturate(ExSdSSAO_GetDepth(inTex) - DepthThreshold) * DepthSensitivity;
    float  e, sample_Depth, dotRangeT = dotRange / IN.Rang;
    int i;
    float2 step = SampStep * float2(Horizontal, !Horizontal);
    
    [unroll] //���[�v�W�J
    for(i = -1; i >= -SAMP_NUM; i--)
    {
        uv           = inTex + step * (float)i;
        sample_nv    = tex2D(NormalMap, uv).xyz * 2.0f - 1.0f;
        sample_Depth = saturate(ExSdSSAO_GetDepth(uv) - DepthThreshold) * DepthSensitivity;
        
        if(depthRange > abs(Depth - sample_Depth)
            && dotRangeT < dot(normalize(nv), normalize(sample_nv)))
        {
            e = exp(-pow(i / (SAMP_NUM * 0.5), 2) * 0.5); //���K���z
            ao += tex2D(samp, uv).r * e;
            cnt += e;
        } else    break;
    }
    
    [unroll] //���[�v�W�J
    for(i = 1; i <= SAMP_NUM; i++)
    {
        uv           = inTex + step * (float)i;
        sample_nv    = tex2D(NormalMap, uv).xyz * 2.0f - 1.0f;
        sample_Depth = saturate(ExSdSSAO_GetDepth(uv) - DepthThreshold) * DepthSensitivity;
        
        if(depthRange > abs(Depth - sample_Depth)
            && dotRangeT < dot(normalize(nv), normalize(sample_nv)))
        {
            e = exp(-pow(i / (SAMP_NUM * 0.5), 2) * 0.5); //���K���z
            ao += tex2D(samp, uv).r * e;
            cnt += e;
        } else if(cnt == 1.0){
            ao += tex2D(samp, float2(inTex.x + halfPixel.x, inTex.y + halfPixel.y)).r
                    + tex2D(samp, float2(inTex.x + halfPixel.x, inTex.y - halfPixel.y)).r
                    + tex2D(samp, float2(inTex.x - halfPixel.x, inTex.y + halfPixel.y)).r
                    + tex2D(samp, float2(inTex.x - halfPixel.x, inTex.y - halfPixel.y)).r;
            ao *= 0.2;
            
            break;
        } else break;
    }
    
    ao /= cnt;
    return float4(ao, ao, ao, 1.0f);
}

//-----------------------------------------------------------------------------
// DLAA
//-----------------------------------------------------------------------------
#define lambda 5.0
#define colorThreshold 0.1
#define Epsilon 0.1

#if usePostAntiAlias
VS_OUTPUT VS_DLAA(float4 Pos:POSITION, float4 Tex:TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0; 
    
    Out.Pos = Pos;
    Out.TexCoord = Tex + ViewportOffset;
    
    return Out;
}

float4 PS_DLAA( float2 inTex: TEXCOORD0 ) : COLOR
{
    float center    = tex2D(SSAOMap, inTex).r;
    float ao        = center;
    
    float left_s    = tex2D(SSAOMap, inTex + float2(halfPixel.x *  3, 0.0)).r;
    float right_s   = tex2D(SSAOMap, inTex + float2(halfPixel.x * -3, 0.0)).r;
    float top_s     = tex2D(SSAOMap, inTex + float2(0.0, halfPixel.y *  3)).r;
    float bottom_s  = tex2D(SSAOMap, inTex + float2(0.0, halfPixel.y * -3)).r;
    
    float w_h = 2.0 * (left_s + right_s);
    float w_v = 2.0 * (top_s + bottom_s);
    
    float edge_h = abs(w_h - 4.0 * center) * 0.25;
    float edge_v = abs(w_v - 4.0 * center) * 0.25;
    
    float blurred_h = (w_h + 2.0 * center) * 0.1666667;
    float blurred_v = (w_v + 2.0 * center) * 0.1666667;
    
    float edge_mask_h = saturate((lambda * edge_h - Epsilon) / blurred_v);
    float edge_mask_v = saturate((lambda * edge_v - Epsilon) / blurred_h);
    
    ao = lerp(ao, blurred_h, edge_mask_v);
    ao = lerp(ao, blurred_v, edge_mask_h);
    
    return float4(ao, ao, ao, 1.0f);
}
#endif

#ifndef EXPORTOR
//-----------------------------------------------------------------------------
// OutPut
//-----------------------------------------------------------------------------
VS_OUTPUT VS_Last(float4 Pos:POSITION, float4 Tex:TEXCOORD0)
{
    VS_OUTPUT Out = (VS_OUTPUT)0; 
    
    Out.Pos = Pos;
    Out.TexCoord = Tex + ViewportOffset;
    
    return Out;
}

float4 PS_Last( float2 inTex: TEXCOORD0 ) : COLOR{   
    
    float ao = 1 - tex2D(ExShadowSSAOMapSamp, inTex).r;
    
    #if ShowSHADOW
        
        //ao = tex2D(SSAOMap, inTex).r;
        return float4(ao, ao, ao, 1);
        
    #else
        
        float4 Color = 0;
        float4 ColorOrg = tex2D(ScnSamp, inTex);;
        
        Color.rgb = lerp(float3(ao, ao, ao), ColorOrg.rgb, optimize * alpha);
        Color.rgb = lerp(Color.rgb, 1.0f , ao) * ColorOrg.rgb;
        
        Color.a = ColorOrg.a;
        
        return Color;
        
    #endif
    
}
#endif

////////////////////////////////////////////////////////////////////////////////////////////////

technique AmbientOcclusion <
    string Script = 
        
        "RenderColorTarget0=SSAOMapRT;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "ClearSetColor=ClearColor;"
        "ClearSetDepth=ClearDepth;"
        "Clear=Color;"
        "Clear=Depth;"
        "Pass=SSAOPass;"
        
        "RenderColorTarget0=BlurMapRT;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "ClearSetColor=ClearColor;"
        "ClearSetDepth=ClearDepth;"
        "Clear=Color;"
        "Clear=Depth;"
        "Pass=BlurPass;"
        
      #if usePostAntiAlias
        "RenderColorTarget0=SSAOMapRT;"
      #else
        "RenderColorTarget0=ExShadowSSAOMapOut;"
      #endif
        "RenderDepthStencilTarget=DepthBuffer;"
        "ClearSetColor=ClearColor;"
        "ClearSetDepth=ClearDepth;"
        "Clear=Color;"
        "Clear=Depth;"
        "Pass=BlurXYPass;"
        
      #if usePostAntiAlias
        "RenderColorTarget0=ExShadowSSAOMapOut;"
        "RenderDepthStencilTarget=DepthBuffer;"
        "ClearSetColor=ClearColor;"
        "ClearSetDepth=ClearDepth;"
        "Clear=Color;"
        "Clear=Depth;"
        "Pass=DLAAPass;"
      #endif
        
        
      #ifndef EXPORTOR
        "RenderColorTarget0=ScnMap;"
        "RenderDepthStencilTarget=DepthBuffer;"
      #else
        "RenderColorTarget0=;"
        "RenderDepthStencilTarget=;"
      #endif
        "ClearSetColor=ClearColor;"
        "ClearSetDepth=ClearDepth;"
        "Clear=Color;"
        "Clear=Depth;"
        "ScriptExternal=Color;"
        
      #ifndef EXPORTOR
        //�ŏI����
        "RenderColorTarget0=;"
        "RenderDepthStencilTarget=;"
        "Pass=LastPass;"
      #endif
        
    ;
> {
    pass SSAOPass < string Script= "Draw=Buffer;"; > {
        AlphaBlendEnable = FALSE;
        VertexShader = compile vs_3_0 VS_SSAO();
        PixelShader  = compile ps_3_0 PS_SSAO();
    }
    
    pass BlurPass < string Script= "Draw=Buffer;"; > {
        AlphaBlendEnable = FALSE;
        VertexShader = compile vs_3_0 VS_BlurX();
        PixelShader  = compile ps_3_0 PS_BlurXY(true, SSAOMap);
    }
    
    pass BlurXYPass < string Script= "Draw=Buffer;"; > {
        AlphaBlendEnable = FALSE;
        VertexShader = compile vs_3_0 VS_BlurY();
        PixelShader  = compile ps_3_0 PS_BlurXY(false, BlurMap);
    }
    
  #if usePostAntiAlias
    pass DLAAPass < string Script= "Draw=Buffer;"; > {
        AlphaBlendEnable = FALSE;
        VertexShader = compile vs_3_0 VS_DLAA();
        PixelShader  = compile ps_3_0 PS_DLAA();
    }
  #endif

  #ifndef EXPORTOR
    pass LastPass < string Script= "Draw=Buffer;"; > {
        AlphaBlendEnable = FALSE;
        AlphaTestEnable = true;
        VertexShader = compile vs_3_0 VS_Last();
        PixelShader  = compile ps_3_0 PS_Last();
    }
  #endif
}
////////////////////////////////////////////////////////////////////////////////////////////////
