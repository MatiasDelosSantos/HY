VERSION 5.00
Begin VB.Form frmcontra2 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Contraseña"
   ClientHeight    =   1845
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   4680
   LinkTopic       =   "Form1"
   ScaleHeight     =   1845
   ScaleWidth      =   4680
   StartUpPosition =   2  'CenterScreen
   Begin VB.CommandButton Command2 
      BackColor       =   &H0080FF80&
      Caption         =   "Cancelar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   2520
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   960
      Width           =   1455
   End
   Begin VB.CommandButton Command1 
      BackColor       =   &H0080FF80&
      Caption         =   "Aceptar"
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   585
      Left            =   960
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   960
      Width           =   1335
   End
   Begin VB.TextBox txtcontra 
      Height          =   495
      IMEMode         =   3  'DISABLE
      Left            =   1320
      PasswordChar    =   "*"
      TabIndex        =   0
      Top             =   360
      Width           =   2175
   End
End
Attribute VB_Name = "frmcontra2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False



Private Sub Command1_Click()
If UCase(txtcontra.Text) = "SOL" Then
    frmremito.detalle.Enabled = False
    frmremito.detalle.SetFocus
    Unload Me
        
Else
    MsgBox "La contraseña es incorrecta vuelva a intentarlo....", vbInformation
    txtcontra.Text = ""
End If
End Sub

Private Sub Command2_Click()
Unload Me

End Sub

Private Sub Form_Activate()
txtcontra.SetFocus
End Sub

Private Sub txtcontra_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub

