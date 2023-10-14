////////////////////////////////////////////////////////////////////////////////////////////////
// �p�����[�^�錾

float opaque : CONTROLOBJECT < string name = "(self)"; string item = "Tr"; >;

shared texture ScreenShadowMap: OFFSCREENRENDERTARGET;
sampler ScreenShadowMapSampler = sampler_state {
    texture = <ScreenShadowMap>;
    MinFilter = LINEAR;
    MagFilter = LINEAR;
    MipFilter = LINEAR;
    AddressU  = CLAMP;
    AddressV = CLAMP;
};

float4x4 worldMatrix : World;
float4x4 projectionMatrix : PROJECTION;
float4x4 view_proj_matrix : ViewProjection;

float fSize = 1.25;

//�r���[�|�[�g�T�C�Y
float2 Viewport : VIEWPORTPIXELSIZE; 

///////////////////////////////////////////////////////////////////////////////////////////////

struct VS_OUTPUT
{
    float4 Pos        : POSITION;    // �ˉe�ϊ����W
    float2 Tex        : TEXCOORD0;   // �e�N�X�`��
};

// ���_�V�F�[�_
VS_OUTPUT Mask_VS(float4 Pos : POSITION, float2 Tex : TEXCOORD0)
{
/*
	//���[�N�̈揉����
	float3 pos = 0;
	//��ʂ̃J�^�`�𐳋K��
	float2 ViewportRatio = normalize(Viewport);
	//�T�C�Y�ݒ�iPos�ɂ�XY���ʂƂ������Ă�j
	//�X�P�[���l��Z�ړ��̗ʁiworldMatrix��4�s�ځj
	pos = Pos * (1 + worldMatrix[3].z * -0.1);
	//Si�ɂ��g��iworldMatrix[1]�ł�����邯��0�ł��ł���̃J�i�j
	pos *= length(worldMatrix[0]) * 0.1;
	//����1:1�Ȃ̂ŁAy�����炷�����₷�����ĉ�ʂ̃J�^�`�ɍ��킹�� 
	pos.y *= Viewport.x / Viewport.y;
	//�Ȃ�ƂȂ�����������������
	pos.xy *= 0.5;
	//�X�N���[�����W�ۑ��p���[�N�̈�
	//world��4�s�ڂɂ�XYZ���W��W��1�������Ă�̂Ł@���������ē����
	float4 tgt2D = worldMatrix[3] * 0.05;
	//���W���Z
	pos += tgt2D.xyz;
	//Z�l�͎ז��Ȃ̂ŏ���
	pos.z = 0;
	//�ŏI�o�͗p�ϐ��ɓ����
	Out.Pos = float4(pos, 1);
*/
	float Aspect = Viewport.x / Viewport.y;
	VS_OUTPUT Out;
	Out.Tex = Tex;

	float3 pos = 0;
	float2 ViewportRatio = normalize(Viewport);
	pos = Pos * (1 + worldMatrix[3].z * -0.1);
	pos *= length(worldMatrix[0]) * 0.1;
//	pos.y *= Viewport.x / Viewport.y;
	pos.xy *= 0.5;
	float4 tgt2D = worldMatrix[3] * 0.05;
	pos += tgt2D.xyz;
	pos.z = 0;
	Out.Pos = float4(pos, 1);

	return Out;
}

// �s�N�Z���V�F�[�_
float4 Mask_PS( float2 Tex :TEXCOORD0 ) : COLOR0
{
	float4 Color = tex2D( ScreenShadowMapSampler, Tex );
    return float4(saturate(Color.rgb), opaque);
}

technique MainTec < string MMDPass = "object"; > {
    pass DrawObject {
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}
technique MainTec_Ss < string MMDPass = "object_ss"; > {
    pass DrawObject {
        VertexShader = compile vs_2_0 Mask_VS();
        PixelShader  = compile ps_2_0 Mask_PS();
    }
}

// �֊s�͕\�����Ȃ�
technique EdgeTec < string MMDPass = "edge"; > { }
// �n�ʉe�͕\�����Ȃ�
technique ShadowTec < string MMDPass = "shadow"; > { }
// MMD�W���̃Z���t�V���h�E�͕\�����Ȃ�
technique ZplotTec < string MMDPass = "zplot"; > { }
