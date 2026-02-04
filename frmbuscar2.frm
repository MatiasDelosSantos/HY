VERSION 5.00
Begin VB.Form frmbuscar2 
   BackColor       =   &H00C0FFC0&
   Caption         =   "Buscar Articulos"
   ClientHeight    =   3315
   ClientLeft      =   60
   ClientTop       =   450
   ClientWidth     =   5760
   LinkTopic       =   "Form1"
   ScaleHeight     =   3315
   ScaleWidth      =   5760
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
      Height          =   495
      Left            =   2760
      Style           =   1  'Graphical
      TabIndex        =   2
      Top             =   2520
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
      Height          =   495
      Left            =   1200
      Style           =   1  'Graphical
      TabIndex        =   1
      Top             =   2520
      Width           =   1455
   End
   Begin VB.OptionButton optart 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Articulo"
      Height          =   495
      Left            =   3840
      TabIndex        =   5
      Top             =   600
      Width           =   1215
   End
   Begin VB.OptionButton optmarca 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Marca"
      Height          =   495
      Left            =   2400
      TabIndex        =   4
      Top             =   600
      Width           =   855
   End
   Begin VB.OptionButton optcodloc 
      BackColor       =   &H00C0FFC0&
      Caption         =   "Cod. Local"
      Height          =   495
      Left            =   600
      TabIndex        =   3
      Top             =   600
      Width           =   1215
   End
   Begin VB.TextBox Text1 
      BeginProperty Font 
         Name            =   "Comic Sans MS"
         Size            =   14.25
         Charset         =   0
         Weight          =   700
         Underline       =   0   'False
         Italic          =   0   'False
         Strikethrough   =   0   'False
      EndProperty
      Height          =   735
      Left            =   1200
      TabIndex        =   0
      Top             =   1560
      Width           =   3015
   End
End
Attribute VB_Name = "frmbuscar2"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = False
Private Sub Command1_Click()
If optcodloc.Value = True Then
    Criterio = Text1.Text
    Criterio = String(5 - Len(Criterio), "0") & Criterio
    Campo = "codigo"
End If
If optmarca.Value = True Then
    Criterio = Text1.Text
    Campo = "marca"
End If
If optart.Value = True Then
    Criterio = Text1.Text
    Campo = "codfab"
End If
frmbuscararticulo.Show vbModal
    rArt.FindFirst "codigo='" & Criterio & "'"
    If Not rArt.NoMatch Then
        cargar2
    End If
Unload Me



End Sub

Private Sub Command2_Click()
Unload Me
End Sub

Private Sub Form_Load()
optcodloc.Value = True

End Sub

Private Sub optart_Click()
 If optart.Value = True Then Text1.SetFocus
    'Campo = "codfab"
End Sub

Private Sub optcodloc_Click()
     If optmarca.Value = True Then Text1.SetFocus
     'Campo = "codigo"
End Sub

Private Sub optmarca_Click()
       If optmarca.Value = True Then Text1.SetFocus
        'Campo = "Marca"
End Sub


Private Sub modelo()
Criterio = Text1.Text
If Criterio = "" Then
    MsgBox "busqueda cancelada por el usuario...", vbInformation, "mensaje"
Else
    Criterio = Trim(Criterio)
    If IsNumeric(Criterio) Then
        Criterio = String(5 - Len(Criterio), "0") & Criterio
        Campo = "codigo"
    Else
        Campo = "Marca"
    End If
    frmbuscararticulo.Show vbModal
    rArt.FindFirst "codigo='" & Criterio & "'"
    If Not rArt.NoMatch Then
        cargar2
    End If
End If
End Sub

Private Sub cargar2()
frmarticulos.txtcodigo.Text = IIf(IsNull(rArt!codigo), "", rArt!codigo)
frmarticulos.Cbomarca.Text = IIf(IsNull(rArt!marca), "", rArt!marca)
frmarticulos.txtdesc.Text = IIf(IsNull(rArt!descripcion), "", rArt!descripcion)
frmarticulos.txtl1.Text = IIf(IsNull(rArt!preciol1), "", rArt!preciol1)
frmarticulos.Txtl2.Text = IIf(IsNull(rArt!preciol2), "", rArt!preciol2)
frmarticulos.txtl3.Text = IIf(IsNull(rArt!preciol3), "", rArt!preciol3)
frmarticulos.txtl4.Text = IIf(IsNull(rArt!preciol4), "", rArt!preciol4)
frmarticulos.txtcodfab.Text = IIf(IsNull(rArt!codfab), "", rArt!codfab)

End Sub

Private Sub Text1_KeyDown(KeyCode As Integer, Shift As Integer)
If KeyCode = 13 Then SendKeys "{TAB}", True
End Sub
