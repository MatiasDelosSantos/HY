VERSION 5.00
Begin VB.Form frmcontra 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Contraseña"
   ClientHeight    =   1770
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   4635
   LinkTopic       =   "Form1"
   ScaleHeight     =   1770
   ScaleWidth      =   4635
   StartUpPosition =   2  'CenterScreen
   Begin VB.TextBox txtcontra 
      Height          =   495
      IMEMode         =   3  'DISABLE
      Left            =   1200
      PasswordChar    =   "*"
      TabIndex        =   0
      Top             =   360
      Width           =   2175
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
      Left            =   840
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   960
      Width           =   1335
   End
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
      Left            =   2400
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   960
      Width           =   1335
   End
End
Attribute VB_Name = "frmcontra"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Command1_Click()

If UCase(txtcontra.Text) = "SOL" Then
    frmarticulos.txtl3.Visible = True
    frmarticulos.cmdlista3.Visible = False
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





